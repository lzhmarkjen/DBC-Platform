# Generated by Django 2.2.5 on 2019-12-03 04:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('admin_id', models.AutoField(primary_key=True, serialize=False)),
                ('admin_desc', models.TextField(null=True)),
                ('admin_icon', models.TextField(null=True)),
                ('identity', models.CharField(max_length=150, null=True)),
                ('phone_num', models.CharField(max_length=50, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('cust_id', models.AutoField(primary_key=True, serialize=False)),
                ('cust_name', models.CharField(max_length=50)),
                ('cust_address', models.CharField(max_length=50)),
                ('cust_email', models.EmailField(max_length=254, null=True)),
                ('cust_co', models.CharField(max_length=150, null=True)),
                ('cust_phone', models.CharField(max_length=50, null=True)),
                ('cust_duty', models.CharField(max_length=50)),
                ('cust_wechat', models.CharField(max_length=50)),
                ('cust_qq', models.CharField(max_length=50)),
                ('cust_business_scope', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_id', models.AutoField(primary_key=True, serialize=False)),
                ('order_date', models.DateField(auto_now=True)),
                ('state', models.IntegerField(default=0)),
                ('order_info', models.TextField(null=True)),
                ('order_amount', models.IntegerField()),
                ('order_payee', models.CharField(max_length=50)),
                ('order_payer', models.CharField(max_length=50)),
                ('order_payee_card', models.CharField(max_length=50)),
                ('order_payee_bank', models.CharField(max_length=100)),
                ('order_payer_card', models.CharField(max_length=50)),
                ('order_payer_bank', models.CharField(max_length=100)),
                ('order_serial', models.CharField(max_length=100)),
                ('order_tex', models.IntegerField()),
                ('order_pay_type', models.CharField(max_length=100)),
                ('order_description', models.TextField()),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Customer')),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('prod_id', models.AutoField(primary_key=True, serialize=False)),
                ('prod_name', models.CharField(max_length=50)),
                ('prod_desc', models.TextField(null=True)),
                ('prod_unit', models.CharField(max_length=50)),
                ('prod_price', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='RepoMessage',
            fields=[
                ('repo_mess_id', models.AutoField(primary_key=True, serialize=False)),
                ('repo_mess_info', models.TextField(null=True)),
                ('quantity', models.IntegerField()),
                ('direction', models.CharField(max_length=50)),
                ('repo_mess_datetime', models.DateTimeField(auto_now=True)),
                ('state', models.CharField(default='未完成', max_length=50)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Product')),
            ],
        ),
        migrations.CreateModel(
            name='Repository',
            fields=[
                ('repo_id', models.AutoField(primary_key=True, serialize=False)),
                ('repo_place', models.CharField(max_length=50)),
                ('repo_name', models.CharField(max_length=50, null=True)),
                ('repo_capacity', models.IntegerField()),
                ('repo_occupy', models.IntegerField(default=0)),
                ('admin', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='dbc2019.Admin')),
            ],
        ),
        migrations.CreateModel(
            name='TransMessage',
            fields=[
                ('trans_mess_id', models.AutoField(primary_key=True, serialize=False)),
                ('trans_mess_info', models.TextField(null=True)),
                ('quantity', models.IntegerField()),
                ('trans_mess_datetime', models.DateTimeField(auto_now=True)),
                ('state', models.CharField(default='未完成', max_length=50)),
                ('flag', models.IntegerField(default=0)),
                ('from_repository', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_mess', to='dbc2019.Repository')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Product')),
                ('to_repository', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_mess', to='dbc2019.Repository')),
            ],
        ),
        migrations.CreateModel(
            name='WorkMessage',
            fields=[
                ('work_mess_id', models.AutoField(primary_key=True, serialize=False)),
                ('work_mess_info', models.TextField(null=True)),
                ('quantity', models.IntegerField()),
                ('direction', models.CharField(max_length=50)),
                ('work_mess_datetime', models.DateTimeField(auto_now=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Admin')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Product')),
                ('repo_message', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='dbc2019.RepoMessage')),
                ('trans_message', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dbc2019.TransMessage')),
            ],
        ),
        migrations.CreateModel(
            name='RepositoryItem',
            fields=[
                ('repo_item_id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Product')),
                ('repository', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='repo_items', to='dbc2019.Repository')),
            ],
        ),
        migrations.AddField(
            model_name='repomessage',
            name='repository',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Repository'),
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('order_item_id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dbc2019.Product')),
            ],
        ),
    ]
