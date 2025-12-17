from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Profile
from .serializers import UserSerializer, UserCreateSerializer, ProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def facilitators(self, request):
        """Get all facilitators"""
        facilitators = User.objects.filter(user_type='facilitator')
        serializer = self.get_serializer(facilitators, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def participants(self, request):
        """Get all participants"""
        participants = User.objects.filter(user_type='participant')
        serializer = self.get_serializer(participants, many=True)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]