from rest_framework import serializers
from .models import Event
from users.serializers import UserSerializer

class EventListSerializer(serializers.ModelSerializer):
    """For list views - minimal data"""
    created_by = serializers.StringRelatedField()
    quest_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 
                  'location', 'is_active', 'created_by', 'quest_count']
    
    def get_quest_count(self, obj):
        return obj.quests.count()

class EventDetailSerializer(serializers.ModelSerializer):
    """For detail views - includes related data"""
    created_by = UserSerializer(read_only=True)
    quests = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 
                  'location', 'is_active', 'created_by', 'created_at', 
                  'updated_at', 'quests']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_quests(self, obj):
        from quests.serializers import QuestListSerializer
        return QuestListSerializer(obj.quests.all(), many=True).data

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'start_date', 'end_date', 
                  'location', 'is_active']
    
    def create(self, validated_data):
        # Get the user from context (will be set in the view)
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)