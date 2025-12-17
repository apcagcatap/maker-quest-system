from rest_framework import serializers
from .models import Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'description', 'icon_url', 'created_at']
        read_only_fields = ['id', 'created_at']