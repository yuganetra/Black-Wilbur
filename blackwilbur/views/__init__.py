from .auth import LoginAPIView ,RegisterAPIView
from .category import CategoryAPIView
from .product import BestsellerAPIView, ExploreAPIView, SearchAPIView, ProductDetailAPIView, CollectionAPIView, ProductManageAPIView
from .orders import OrdersAPIView
from .cart import CartAPIView
from .sendsmsview import SendSmsView
from .rating import RatingAPIView
from .product_variation import ProductVariationAPIView
from .image import ImageManageAPIView
from .discount import DiscountAPIView
from .user import UserListAPIView
from .index import index
from .shippingaddress import ShippingAddressAPIView
from .generate_invoice import generate_invoice
from .payment import CreateRazorpayOrderView,VerifyPaymentView
