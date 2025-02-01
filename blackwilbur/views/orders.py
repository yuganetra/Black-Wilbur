import uuid  # Import UUID module
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from blackwilbur import models, serializers
from rest_framework.permissions import IsAuthenticated

class OrdersAPIView(APIView):

    def get(self, request):
        user = request.user

        if user.is_authenticated:
            if user.is_superuser:
                orders = models.Order.objects.all()
            else:
                orders = models.Order.objects.filter(user=user)
        else:
            orders = models.Order.objects.all()

        orders_data = []

        for order in orders:
            order_items = models.OrderItem.objects.filter(order=order)
            items_data = []

            for item in order_items:
                item_data = {
                    "product": {
                        "id": item.product.id,
                        "name": item.product.name,
                        "price": str(item.product.price),
                        "image": item.product.image
                    },
                    "quantity": item.quantity,
                    "product_variation": {
                        "id": item.product_variation.id,
                        "size": item.product_variation.size,
                    },
                    "price": str(item.price),
                    "tax_amount": str(item.tax_amount),
                    "total_price": str(item.total_price),
                }
                items_data.append(item_data)

            if user.is_authenticated:
                if user.is_superuser:
                    order_user = order.user
                    user_name = order_user.get_full_name() or order_user.first_name
                else:
                    user_name = user.get_full_name() or user.first_name
            else:
                order_user = order.user
                user_name = order_user.get_full_name() or order_user.first_name

            shipping_address = order.shipping_address
            shipping_address_data = {
                "address_line1": shipping_address.address_line1 if shipping_address else None,
                "address_line2": shipping_address.address_line2 if shipping_address else None,
                "city": shipping_address.city if shipping_address else None,
                "state": shipping_address.state if shipping_address else None,
                "zipcode": shipping_address.zipcode if shipping_address else None,
                "country": shipping_address.country if shipping_address else None,
            }
            order_data = {
                "user_name": user_name,
                "phone_number": order.phone_number,
                "order_id": order.order_id,
                "created_at": order.created_at,
                "status": order.status,
                "subtotal": str(order.subtotal),
                "discount_amount": str(order.discount_amount),
                "discount_coupon_applied": order.discount_coupon_applied,
                "tax_amount": str(order.tax_amount),
                "total_amount": str(order.total_amount),
                "shipping_address": shipping_address_data,
                "items": items_data
            }
            orders_data.append(order_data)

        return Response(orders_data, status=status.HTTP_200_OK)

    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received POST request with data:", request.data)

        products_data = request.data.get('products', [])
        print("Extracted products data:", products_data)
        shipping_address_data = request.data.get(
            'shipping_address', {})
        print("shipping_address_data", shipping_address_data)

        order_serializer = serializers.OrderSerializer(data=request.data)
        print("Order serializer initialized with data:", request.data)

        shipping_address_data['user'] = request.user.id

        shipping_address_serializer = serializers.ShippingAddressSerializer(
            data=shipping_address_data)
        if not shipping_address_serializer.is_valid():
            print("Shipping address validation failed with errors:",
                  shipping_address_serializer.errors)
            return Response(shipping_address_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not order_serializer.is_valid():
            print("Order validation failed with errors:",
                  order_serializer.errors)
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = str(uuid.uuid4())
        print("Generated new order UUID:", order_id)

        new_shipping_address = models.ShippingAddress.objects.create(
            user=request.user,
            address_line1=shipping_address_data.get('address_line1'),
            address_line2=shipping_address_data.get('address_line2'),
            zipcode=shipping_address_data.get('zipcode'),
            city=shipping_address_data.get('city'),
            state=shipping_address_data.get('state'),
            country=shipping_address_data.get('country'),
        )
        print("Shipping address created:", new_shipping_address.id)

        order_data = {key: value for key, value in order_serializer.validated_data.items()
                      if key not in ['user', 'shipping_address']}

        new_order = models.Order.objects.create(
            **order_data,
            user=request.user,
            order_id=order_id,
            shipping_address=new_shipping_address,
        )

        print("Order created with ID:", new_order.order_id)

        subtotal = Decimal(0)
        total_discount_value = Decimal(request.data.get(
            'discount_amount', 0))
        total_tax = Decimal(request.data.get(
            'tax_amount', 0))

        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')
            product_variation_id = product_data.get('product_variation_id')

            if not product_variation_id:
                return Response({"error": f"Product variation for product ID {product_id} is missing."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = models.Product.objects.get(id=product_id)
                item_price = Decimal(product.price) * quantity

                subtotal += item_price

                item_discount = (item_price / subtotal) * \
                    total_discount_value if subtotal else Decimal(0)

                item_tax = (total_tax / len(products_data)
                            ) if total_tax else Decimal(0)

                item_total_price = item_price - item_discount + item_tax

                models.OrderItem.objects.create(
                    order=new_order,
                    product=product,
                    quantity=quantity,
                    product_variation_id=product_variation_id,
                    price=product.price,
                    tax_amount=item_tax,
                    total_price=item_total_price
                )

                product_variation = models.ProductVariation.objects.get(
                    id=product_variation_id)
                product_variation.quantity -= quantity
                product_variation.save()

            except models.Product.DoesNotExist:
                return Response({"error": f"Product with ID {product_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        total_amount = subtotal - total_discount_value + total_tax

        new_order.subtotal = subtotal
        new_order.discount_amount = total_discount_value
        new_order.tax_amount = total_tax
        new_order.total_amount = total_amount

        new_shipping_address.save()
        new_order.save()

        return Response({
            "message": "Order created successfully.",
            "order_id": new_order.order_id
        }, status=status.HTTP_201_CREATED)