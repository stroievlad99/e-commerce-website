# Generated by Django 3.2.16 on 2023-05-25 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_auto_20230518_2205'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='C:/Users/Admin/Desktop/ecommerce-v2/e-commerce-website/frontend/public/images/sample.jpg', null=True, upload_to=''),
        ),
    ]
