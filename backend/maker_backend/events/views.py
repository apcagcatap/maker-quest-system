from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.utils import timezone
from .models import Event
from .serializers import (
    EventListSerializer, 
    EventDetailSerializer, 
    EventCreateSerializer
)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateSerializer
        return EventDetailSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active events"""
        active_events = Event.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        serializer = EventListSerializer(active_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        upcoming_events = Event.objects.filter(
            is_active=True,
            start_date__gt=timezone.now()
        )
        serializer = EventListSerializer(upcoming_events, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def quests(self, request, pk=None):
        """Get all quests for this event"""
        event = self.get_object()
        from quests.serializers import QuestListSerializer
        serializer = QuestListSerializer(event.quests.all(), many=True)
        return Response(serializer.data)