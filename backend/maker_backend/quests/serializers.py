from rest_framework import serializers
from .models import (
    Quest, Task, QuestProgress, TaskCompletion, 
    Badge, Certificate, ParticipantSkill
)
from skills.serializers import SkillSerializer
from users.serializers import UserSerializer

# Task Serializers
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'image_url']

class TaskSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'quest', 'title', 'description', 'order', 
                  'ai_generated_context', 'qr_code', 'created_at', 'badge']
        read_only_fields = ['id', 'qr_code', 'created_at']

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['quest', 'title', 'description', 'order']

# Quest Serializers
class QuestListSerializer(serializers.ModelSerializer):
    """For list views"""
    skills = SkillSerializer(many=True, read_only=True)
    task_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quest
        fields = ['id', 'event', 'title', 'description', 'difficulty', 
                  'skills', 'task_count', 'created_at']
    
    def get_task_count(self, obj):
        return obj.tasks.count()

class QuestDetailSerializer(serializers.ModelSerializer):
    """For detail views - includes all tasks"""
    skills = SkillSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Quest
        fields = ['id', 'event', 'title', 'description', 'difficulty', 
                  'ai_generated_story', 'skills', 'tasks', 'created_by', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class QuestCreateSerializer(serializers.ModelSerializer):
    skill_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    
    class Meta:
        model = Quest
        fields = ['event', 'title', 'description', 'difficulty', 'skill_ids']
    
    def create(self, validated_data):
        skill_ids = validated_data.pop('skill_ids', [])
        user = self.context['request'].user
        validated_data['created_by'] = user
        
        quest = Quest.objects.create(**validated_data)
        quest.skills.set(skill_ids)
        return quest

# Progress Serializers
class TaskCompletionSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    validated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskCompletion
        fields = ['id', 'progress', 'task', 'completed_at', 'validated_by']
        read_only_fields = ['id', 'completed_at']

class QuestProgressSerializer(serializers.ModelSerializer):
    participant = UserSerializer(read_only=True)
    quest = QuestDetailSerializer(read_only=True)
    task_completions = TaskCompletionSerializer(many=True, read_only=True)
    completion_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = QuestProgress
        fields = ['id', 'participant', 'quest', 'started_at', 'completed_at', 
                  'is_completed', 'task_completions', 'completion_percentage']
        read_only_fields = ['id', 'started_at', 'completed_at']
    
    def get_completion_percentage(self, obj):
        total_tasks = obj.quest.tasks.count()
        if total_tasks == 0:
            return 0
        completed_tasks = obj.task_completions.count()
        return int((completed_tasks / total_tasks) * 100)

# Certificate Serializer
class CertificateSerializer(serializers.ModelSerializer):
    quest = QuestListSerializer(read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'quest', 'template', 'created_at']
        read_only_fields = ['id', 'created_at']

# Participant Skill Serializer
class ParticipantSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    quest = QuestListSerializer(read_only=True)
    participant = UserSerializer(read_only=True)
    
    class Meta:
        model = ParticipantSkill
        fields = ['id', 'participant', 'skill', 'quest', 'acquired_at']
        read_only_fields = ['id', 'acquired_at']