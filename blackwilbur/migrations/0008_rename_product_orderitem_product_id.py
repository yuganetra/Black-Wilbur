# Generated by Django 5.0.7 on 2024-10-19 19:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blackwilbur', '0007_rename_user_order_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderitem',
            old_name='product',
            new_name='product_id',
        ),
    ]
