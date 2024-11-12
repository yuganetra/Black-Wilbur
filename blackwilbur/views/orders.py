import uuid  # Import UUID module
from decimal import Decimal
from django.db.models import Sum, F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, exceptions
from blackwilbur import models, serializers, services
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from decimal import Decimal

class OrdersAPIView(APIView):

    def get(self, request):
        user = request.user

        # Check if the user is authenticated and retrieve orders accordingly
        if user.is_authenticated:
            orders = models.Order.objects.filter(user=user)
        else:
            orders = models.Order.objects.all()  # Fetch all orders if no specific user is set

        orders_data = []

        for order in orders:
            order_items = models.OrderItem.objects.filter(order=order)
            items_data = []

            # Calculate item-specific fields (subtotal, discount, tax, total)
            for item in order_items:
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
                    "price": str(item.price),
                    "discount_amount": str(item.discount_amount),
                    "tax_amount": str(item.tax_amount),
                    "total_price": str(item.total_price),
                }
                items_data.append(item_data)

            # Add user's name and phone number to each order's data
            order_data = {
                "user_name": user.get_full_name() or user.username,  # Use full name if available, otherwise username
                "phone_number": user.profile.phone_number if hasattr(user, 'profile') and user.profile.phone_number else "N/A",
                "order_id": order.order_id,
                "created_at": order.created_at,
                "status": order.status,
                "payment_status": order.payment_status,
                "subtotal": str(order.subtotal),
                "discount_amount": str(order.discount_amount),
                "tax_amount": str(order.tax_amount),
                "total_amount": str(order.total_amount),
                "items": items_data  # Include items with calculated fields in the order data
            }
            orders_data.append(order_data)

        return Response(orders_data, status=status.HTTP_200_OK)
    
        # permission_classes = [IsAuthenticated]
    def post(self, request):
        print("Received POST request with data:", request.data)

        products_data = request.data.pop('products', [])
        print("Extracted products data:", products_data)

        order_serializer = serializers.OrderSerializer(data=request.data)
        print("Order serializer initialized with data:", request.data)

        if not order_serializer.is_valid():
            print("Validation failed with errors:", order_serializer.errors)
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = str(uuid.uuid4())
        print("Generated new order UUID:", order_id)

        # Check for existing order
        try:
            order = models.Order.objects.get(order_id=order_id, user=request.user)
            print("Order already exists with order_id:", order_id)
            return Response({"error": "Order already exists!"}, status=status.HTTP_400_BAD_REQUEST)
        except models.Order.DoesNotExist:
            print("No existing order found. Creating new order...")

            # Create a new order with initial subtotal, discount, tax, shipping, and total values as zero
            new_order = models.Order.objects.create(
                **{key: value for key, value in order_serializer.validated_data.items() if key != 'user'},
                user=request.user,
                order_id=order_id,
                subtotal=Decimal(0),
                discount_amount=Decimal(0),
                tax_amount=Decimal(0),
                shipping_cost=Decimal(0),
                total_amount=Decimal(0)
            )
            print("New order created with ID:", new_order.order_id)

        # Calculate subtotal from product prices and apply discount if provided
        subtotal = Decimal(0)
        discount_amount = Decimal(request.data.get('discount_amount', 0))
        tax_amount = Decimal(request.data.get('tax_amount', 0))
        shipping_cost = Decimal(request.data.get('shipping_cost', 0))

        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')
            product_variation_id = product_data.get('product_variation_id')

            if not product_variation_id:
                return Response({"error": f"Product variation for product ID {product_id} is missing."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = models.Product.objects.get(id=product_id)
                print(f"Product found: {product.name}")

                item_price = product.price * quantity
                subtotal += item_price

                # Create order item with calculated fields
                models.OrderItem.objects.create(
                    order=new_order,
                    product=product,
                    quantity=quantity,
                    product_variation_id=product_variation_id,
                    price=product.price,
                    discount_amount=discount_amount,
                    tax_amount=tax_amount,
                    total_price=item_price
                )
                print(f"OrderItem created for product: {product.name}, quantity: {quantity}")

                # Update product variation quantity
                product_variation = models.ProductVariation.objects.get(id=product_variation_id)
                product_variation.quantity -= quantity
                product_variation.save()
                print(f"Updated product variation quantity for {product_variation.size}")

            except models.Product.DoesNotExist:
                print(f"Product with ID {product_id} not found.")
                return Response({"error": f"Product with ID {product_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Calculate final order totals
        total_amount = subtotal - discount_amount + tax_amount + shipping_cost
        new_order.subtotal = subtotal
        new_order.discount_amount = discount_amount
        new_order.tax_amount = tax_amount
        new_order.shipping_cost = shipping_cost
        new_order.total_amount = total_amount
        new_order.save()

        print(f"Order ID: {new_order.order_id}, Subtotal: {subtotal}, Discount: {discount_amount}, Tax: {tax_amount}, Shipping: {shipping_cost}, Total Amount: {total_amount}")

        # Check payment method
        if new_order.payment_method == 'cash_on_delivery':
            return Response({
                'order_id': new_order.order_id,
                'message': "Order successfully created with Cash on Delivery payment method."
            }, status=status.HTTP_200_OK)

        # Proceed with payment if payment method is UPI
        payment_service = services.PaymentService()
        amount_in_paise = int(total_amount * 100)  # Convert rupees to paise

        user_id = str(request.user.id)
        mobile_number = request.data.get('phone_number', '9999999999')

        payment_response = payment_service.pay(amount=amount_in_paise, user_id=user_id, mobile_number=mobile_number)

        if isinstance(payment_response, HttpResponse) and payment_response.status_code != 200:
            return HttpResponse(payment_response.content, status=payment_response.status_code)

        if isinstance(payment_response, HttpResponse):
            url = payment_response.content.decode("utf-8").replace("Payment URL: ", "")
            new_order.payment_status = 'paid'
            new_order.save()

            return Response({
                'order_id': new_order.order_id,
                'payment_url': url
            }, status=status.HTTP_200_OK)

        return Response({"error": "Payment initiation failed."}, status=status.HTTP_400_BAD_REQUEST)
