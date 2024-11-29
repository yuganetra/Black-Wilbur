from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate
from io import BytesIO
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from blackwilbur.models import Order, OrderItem

def generate_invoice(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)
        order_items = OrderItem.objects.filter(order=order)
        shipping_address = order.shipping_address
    except Order.DoesNotExist:
        return HttpResponse("Order not found", status=404)

    # Render HTML template to string
    context = {
        'order': order,
        'order_items': order_items,
        'shipping_address': shipping_address,
    }
    html_string = render_to_string('invoice.html', context)

    # Create PDF
    buffer = BytesIO()
    pdf_file = BytesIO()
    
    # Convert HTML to PDF
    pisa.CreatePDF(html_string, dest=pdf_file)
    
    pdf_file.seek(0)
    
    # Return PDF response
    response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'filename="invoice_{order_id}.pdf"'
    return response