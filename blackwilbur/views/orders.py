import uuid  # Import UUID module
from django.db.models import Max, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from blackwilbur import models, serializers,services
from rest_framework.permissions import IsAuthenticated

class OrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = models.Order.objects.filter(user=user)
        orders_data = []

        for order in orders:
            order_items = models.OrderItem.objects.filter(order=order)
            items_data = []

            # Calculate subtotal for each item
            for item in order_items:
                subtotal = item.quantity * item.product.price  # Calculate the subtotal
                item_data = {
                    "product": {
                        "id": item.product.id,
                        "name": item.product.name,
                        "price": str(item.product.price),
                    },
                    "quantity": item.quantity,
                    "product_variation": {
                        "id": item.product_variation.id,
                        "size": item.product_variation.size,
                    },
                    "subtotal": str(subtotal)  # Add subtotal to item data
                }
                items_data.append(item_data)

            order_data = {
                "order_id": order.order_id,
                "created_at": order.created_at,
                "status": order.status,
                "items": items_data  # Include items with subtotal in the order data
            }
            orders_data.append(order_data)

        return Response(orders_data, status=status.HTTP_200_OK)

    def post(self, request):
        print("Received POST request with data:", request.data)  # Log incoming data

        products_data = request.data.pop('products', [])
        print("Extracted products data:", products_data)

        order_serializer = serializers.OrderSerializer(data=request.data)
        print("Order serializer initialized with data:", request.data)

        if not order_serializer.is_valid():
            print("Validation failed with errors:", order_serializer.errors)
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print("Order data validated successfully.")

        order_id = str(uuid.uuid4())
        print("Generated new order UUID:", order_id)

        try:
            order = models.Order.objects.get(order_id=order_id, user=request.user)
            print("Order already exists with order_id:", order_id)
            return Response({"error": "Order already exists!"}, status=status.HTTP_400_BAD_REQUEST)
        except models.Order.DoesNotExist:
            print("No existing order found. Creating new order...")

            new_order = models.Order.objects.create(
                **{key: value for key, value in order_serializer.validated_data.items() if key != 'user'},
                user=request.user,
                order_id=order_id
            )
            print("New order created with ID:", new_order.order_id)

        total_amount = 0
        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')
            product_variation_id = product_data.get('product_variation_id')

            if not product_variation_id:
                print(f"Missing product_variation_id for product ID: {product_id}")
                return Response({"error": f"Product variation for product ID {product_id} is missing."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = models.Product.objects.get(id=product_id)
                print(f"Product found: {product.name}")
                # Calculate the total price for this product and quantity
                total_amount += product.price * quantity

                models.OrderItem.objects.create(
                    order=new_order,
                    product=product,
                    quantity=quantity,
                    product_variation_id=product_variation_id
                )
                print(f"OrderItem created for product: {product.name}, quantity: {quantity}")

            except models.Product.DoesNotExist:
                print(f"Product with ID {product_id} not found.")
                return Response({"error": f"Product with ID {product_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        total_amount = float(total_amount)  # Convert to float
        new_order.total_amount = total_amount
        new_order.save()

        user_email = request.data.get('email')  # Get email directly from order data
        print(request.user.id)
        print(new_order.total_amount)

        # After saving the order, initiate the payment
        payment_service = services.PaymentService()

        try:
            payment_url = payment_service.initiate_payment(amount=total_amount, user_id=user_email)
            print("payment_url", payment_url)

            # Return both order_id and payment_url
            return Response({
                "order_id": new_order.order_id,
                "payment_url": payment_url if payment_url else "Payment URL not generated"
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error initiating payment: {str(e)}")

            # If payment fails, return order_id with the error message
            return Response({
                "error": str(e),
                "order_id": new_order.order_id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
