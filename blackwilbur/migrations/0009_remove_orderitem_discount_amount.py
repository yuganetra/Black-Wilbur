# Generated by Django 5.0.7 on 2024-11-28 20:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blackwilbur', '0008_rename_address_line_1_shippingaddress_address_line1_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='discount_amount',
        ),
    ]
