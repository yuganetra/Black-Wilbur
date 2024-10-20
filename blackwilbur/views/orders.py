from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur import models, serializers
from rest_framework.permissions import IsAuthenticated

class OrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = models.Order.objects.filter(user=user)
        orders_data = []

        for order in orders:
            order_items = models.OrderItem.objects.filter(order=order)
            order_data = {
                "order_id": order.order_id,  # Include order_id
                "created_at": order.created_at,  # Include order created datetime
                "status": order.status,  # Include order status
                "items": serializers.OrderItemSerializer(order_items, many=True).data
            }
            orders_data.append(order_data)

        return Response(orders_data, status=status.HTTP_200_OK)

    def post(self, request):
        print("Received POST request with data:", request.data)  # Log incoming data

        # Extract products data before validating the order
        products_data = request.data.pop('products', [])
        print("Extracted products data:", products_data)  # Log extracted products

        # Validate the request data with the Order serializer (excluding user)
        order_serializer = serializers.OrderSerializer(data=request.data)
        print("Order serializer initialized with data:", request.data)  # Log data being validated

        # Check if the order_serializer is valid
        if not order_serializer.is_valid():
            print("Validation failed with errors:", order_serializer.errors)  # Log validation errors
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print("Order data validated successfully.")  # Log successful validation

        # Check if the order already exists
        order_id = order_serializer.validated_data.get('order_id')
        print("Checking for existing order with order_id:", order_id)  # Log order ID check

        try:
            order = models.Order.objects.get(order_id=order_id, user=request.user)
            print("Order already exists with order_id:", order_id)  # Log if order already exists
            return Response({"error": "Order already exists!"}, status=status.HTTP_400_BAD_REQUEST)
        except models.Order.DoesNotExist:
            print("No existing order found. Creating new order...")  # Log if order does not exist

            # Create a new order, explicitly setting the user from the request
            new_order = models.Order.objects.create(
                **{key: value for key, value in order_serializer.validated_data.items() if key != 'user'},  # Exclude 'user' from validated data
                user=request.user  # Set user from request
            )
            print("New order created with ID:", new_order.order_id)  # Log newly created order

        # Insert each product into the OrderItem table
# Insert each product into the OrderItem table
        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')
            product_variation_id = product_data.get('product_variation_id')
            
            if not product_variation_id:
                # Log and return an error if the product variation is missing
                print(f"Missing product_variation_id for product ID: {product_id}")
                return Response({"error": f"Product variation for product ID {product_id} is missing."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = models.Product.objects.get(id=product_id)
                print(f"Product found: {product.name}")

                # Create the OrderItem with the correct product_variation_id
                models.OrderItem.objects.create(
                    order=new_order,
                    product=product,
                    quantity=quantity,
                    product_variation_id=product_variation_id  # Ensure this field is passed
                )
                print(f"OrderItem created for product: {product.name}, quantity: {quantity}")

            except models.Product.DoesNotExist:
                print(f"Product with ID {product_id} not found.")
                return Response({"error": f"Product with ID {product_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        # Return the newly created order's details
        print("Order creation complete. Returning response with order_id:", new_order.order_id)  # Log order creation completion
        return Response({"order_id": new_order.order_id}, status=status.HTTP_201_CREATED)
