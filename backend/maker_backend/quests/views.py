from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import (
    Quest, Task, QuestProgress, TaskCompletion,
    Badge, Certificate, ParticipantSkill
)
from .serializers import (
    QuestListSerializer, QuestDetailSerializer, QuestCreateSerializer,
    TaskSerializer, TaskCreateSerializer,
    QuestProgressSerializer, TaskCompletionSerializer,
    BadgeSerializer, CertificateSerializer, ParticipantSkillSerializer
)

class QuestViewSet(viewsets.ModelViewSet):
    queryset = Quest.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'difficulty']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return QuestListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return QuestCreateSerializer
        return QuestDetailSerializer
    
    @action(detail=True, methods=['post'])
    def generate_story(self, request, pk=None):
        """Generate AI story for quest"""
        quest = self.get_object()
        # We'll implement AI generation later
        return Response({
            'message': 'AI story generation will be implemented',
            'quest_id': quest.id
        })
    
    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """Get all tasks for this quest"""
        quest = self.get_object()
        serializer = TaskSerializer(quest.tasks.all(), many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start a quest (for participants)"""
        quest = self.get_object()
        participant = request.user
        
        # Check if already started
        progress, created = QuestProgress.objects.get_or_create(
            participant=participant,
            quest=quest
        )
        
        if not created:
            return Response(
                {'message': 'Quest already started'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = QuestProgressSerializer(progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateSerializer
        return TaskSerializer
    
    @action(detail=True, methods=['post'])
    def generate_context(self, request, pk=None):
        """Generate AI context for task"""
        task = self.get_object()
        # We'll implement AI generation later
        return Response({
            'message': 'AI context generation will be implemented',
            'task_id': task.id
        })
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """Validate task completion via QR code"""
        task = self.get_object()
        qr_code = request.data.get('qr_code')
        participant_id = request.data.get('participant_id')
        
        if not qr_code or not participant_id:
            return Response(
                {'error': 'qr_code and participant_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify QR code matches
        if str(task.qr_code) != qr_code:
            return Response(
                {'error': 'Invalid QR code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get quest progress
        try:
            progress = QuestProgress.objects.get(
                participant_id=participant_id,
                quest=task.quest
            )
        except QuestProgress.DoesNotExist:
            return Response(
                {'error': 'Quest not started by this participant'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create task completion
        completion, created = TaskCompletion.objects.get_or_create(
            progress=progress,
            task=task,
            defaults={'validated_by': request.user}
        )
        
        if not created:
            return Response(
                {'message': 'Task already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if all tasks completed
        total_tasks = task.quest.tasks.count()
        completed_tasks = progress.task_completions.count()
        
        if total_tasks == completed_tasks:
            progress.is_completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
            # Award skills
            for skill in task.quest.skills.all():
                ParticipantSkill.objects.get_or_create(
                    participant=progress.participant,
                    skill=skill,
                    quest=task.quest
                )
        
        serializer = TaskCompletionSerializer(completion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuestProgressViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuestProgress.objects.all()
    serializer_class = QuestProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter by current user if participant
        user = self.request.user
        if user.user_type == 'participant':
            return QuestProgress.objects.filter(participant=user)
        return QuestProgress.objects.all()
    
    @action(detail=False, methods=['get'])
    def my_progress(self, request):
        """Get current user's quest progress"""
        progress = QuestProgress.objects.filter(participant=request.user)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)

class TaskCompletionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskCompletion.objects.all()
    serializer_class = TaskCompletionSerializer
    permission_classes = [IsAuthenticated]

class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ParticipantSkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ParticipantSkill.objects.all()
    serializer_class = ParticipantSkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'participant':
            return ParticipantSkill.objects.filter(participant=user)
        return ParticipantSkill.objects.all()
    
    @action(detail=False, methods=['get'])
    def my_skills(self, request):
        """Get current user's acquired skills"""
        skills = ParticipantSkill.objects.filter(participant=request.user)
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)