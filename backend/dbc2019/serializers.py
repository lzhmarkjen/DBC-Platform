from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *


# util func
def get_out_work_mess_info(prod_name, quantity):
    return '出库' + prod_name + str(quantity)


def get_in_work_mess_info(prod_name, quantity):
    return '入库' + prod_name + str(quantity)


# url api/repository/dashboard
class DashboardRepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['repo_id', 'repo_name', 'repo_capacity', 'repo_occupy']


class DashboardWorkMessSerializer(serializers.ModelSerializer):
    admin_id = serializers.PrimaryKeyRelatedField(source='admin', queryset=User.objects.all())

    class Meta:
        model = WorkMessage
        fields = ['admin_id', 'work_mess_id', 'work_mess_info']


class DashboardRepoMessSerializer(serializers.ModelSerializer):
    prod_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    repo_id = serializers.PrimaryKeyRelatedField(source='repository', queryset=Repository.objects.all())
    prod_name = serializers.SlugRelatedField(source='product', slug_field='prod_name', read_only=True)
    repo_name = serializers.SlugRelatedField(source='repository', slug_field='repo_name', read_only=True)

    class Meta:
        model = RepoMessage
        fields = ['repo_mess_id', 'repo_mess_info', 'direction', 'quantity',
                  'prod_name', 'prod_id', 'repo_name', 'repo_id']


class DashboardSerializer(serializers.Serializer):
    Repo = DashboardRepositorySerializer(source='repo', many=True)
    Messages = DashboardWorkMessSerializer(source='work_mess', many=True)
    RepoMessIn = DashboardRepoMessSerializer(source='repo_mess_in', many=True)
    RepoMessOut = DashboardRepoMessSerializer(source='repo_mess_out', many=True)


# url api/repository/in,out
class RepoMessSerializer(serializers.ModelSerializer):
    prod_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    repo_id = serializers.PrimaryKeyRelatedField(source='repository', queryset=Repository.objects.all())
    prod_name = serializers.SlugRelatedField(source='product', slug_field='prod_name', read_only=True)
    repo_name = serializers.SlugRelatedField(source='repository', slug_field='repo_name', read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(source='order', queryset=Order.objects.all())

    class Meta:
        model = RepoMessage
        fields = ['repo_mess_id', 'repo_mess_info', 'direction', 'quantity',
                  'prod_name', 'prod_id', 'repo_name', 'repo_id', 'order_id']

    def create(self, validated_data):
        repo_mess = RepoMessage.objects.create(**validated_data)

        # add a work_mess when add repo_mess
        product = validated_data.get('product')
        repository = validated_data.get('repository')
        admin = repository.admin
        quantity = validated_data.get('quantity')
        direction = validated_data.get('direction')
        if direction == 'IN':
            work_mess_info = get_in_work_mess_info(product.prod_name, quantity)
        else:
            work_mess_info = get_out_work_mess_info(product.prod_name, quantity)
        WorkMessage.objects.create(quantity=quantity,
                                   direction=direction,
                                   work_mess_info=work_mess_info,
                                   product=product, admin=admin,
                                   repo_message=repo_mess)
        return repo_mess


class InOutRepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = ['repo_id', 'repo_name']


class InOutProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['prod_id', 'prod_name']


class InOutOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_id']


class InSerializer(serializers.Serializer):
    RepoMessIn = RepoMessSerializer(source='repo_mess_in', many=True)
    Repo = InOutRepositorySerializer(source='repo', many=True)
    Prod = InOutProductSerializer(source='prod', many=True)
    Order = InOutOrderSerializer(source='order', many=True)


class OutSerializer(serializers.Serializer):
    RepoMessOut = RepoMessSerializer(source='repo_mess_in', many=True)
    Repo = InOutRepositorySerializer(source='repo', many=True)
    Prod = InOutProductSerializer(source='prod', many=True)
    Order = InOutOrderSerializer(source='order', many=True)


# url api/repository/trans
class TransMessSerializer(serializers.ModelSerializer):
    repo_out_id = serializers.PrimaryKeyRelatedField(source='from_repository', queryset=Repository.objects.all())
    repo_in_id = serializers.PrimaryKeyRelatedField(source='to_repository', queryset=Repository.objects.all())
    prod_out_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())

    class Meta:
        model = TransMessage
        fields = ['repo_out_id', 'repo_in_id', 'prod_out_id', 'quantity', 'trans_mess_info']

    def create(self, validated_data):
        trans_mess = TransMessage.objects.create(**validated_data)

        # add two work_mess point to trans_mess
        repository_out = validated_data.get('from_repository')
        repository_in = validated_data.get('to_repository')
        quantity = validated_data.get('quantity')
        product = validated_data.get('product')
        admin_out = repository_out.admin
        admin_in = repository_in.admin
        work_mess_info_out = get_out_work_mess_info(product.prod_name, quantity)
        work_mess_info_in = get_in_work_mess_info(product.prod_name, quantity)

        WorkMessage.objects.create(work_mess_info=work_mess_info_out,
                                   quantity=quantity,
                                   direction='OUT',
                                   admin=admin_out,
                                   product=product,
                                   trans_message=trans_mess)
        WorkMessage.objects.create(work_mess_info=work_mess_info_in,
                                   quantity=quantity,
                                   direction='IN',
                                   admin=admin_in,
                                   product=product,
                                   trans_message=trans_mess)

        return trans_mess


class TransRepoItemSerializer(serializers.ModelSerializer):
    prod_id = serializers.PrimaryKeyRelatedField(source='product', read_only=True)
    prod_name = serializers.SlugRelatedField(source='product', slug_field='prod_name', read_only=True)

    class Meta:
        model = RepositoryItem
        fields = ['quantity', 'prod_id', 'prod_name']


class TransRepositorySerializer(serializers.ModelSerializer):
    RepoItem = TransRepoItemSerializer(source='repo_items', many=True, read_only=True)

    class Meta:
        model = Repository
        fields = ['repo_id', 'repo_name', 'RepoItem']


class TransSerializer(serializers.Serializer):
    Repo = TransRepositorySerializer(source='repo', many=True)


# url api/order
class OrderOrderSerializer(serializers.ModelSerializer):
    cust_name = serializers.SlugRelatedField(source='customer', slug_field='cust_name', read_only=True)
    cust_co = serializers.SlugRelatedField(source='customer', slug_field='cust_co', read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'order_info', 'state', 'order_date', 'cust_name', 'state', 'cust_co']


class OrderCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['cust_id', 'cust_name', 'cust_co']


class ApiOrderGetSerializer(serializers.Serializer):
    Order = OrderOrderSerializer()
    Cust = OrderCustomerSerializer()


class ApiOrderPostSerializer(serializers.ModelSerializer):
    cust_id = serializers.SlugRelatedField(source='customer', slug_field='cust_id', queryset=Customer.objects.all())

    class Meta:
        model = Customer
        fields = ['cust_id', 'order_info', 'state']

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.state = validated_data.get('state', instance.state)
        instance.save()
        return instance
