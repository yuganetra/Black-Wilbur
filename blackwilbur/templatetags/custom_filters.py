from decimal import Decimal
from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    # Ensure both value and arg are Decimal
    if isinstance(value, Decimal) and isinstance(arg, (int, float, Decimal)):
        return value * Decimal(str(arg))
    return value * arg  # Handle the case where either value or arg is not Decimal

@register.filter(name='subtract')
def subtract(value, arg):
    try:
        return value - arg
    except (TypeError, ValueError):
        return value
