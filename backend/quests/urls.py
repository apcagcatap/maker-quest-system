from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuestViewSet, TaskViewSet, QuestProgressViewSet,
    TaskCompletionViewSet, BadgeViewSet, CertificateViewSet,
    ParticipantSkillViewSet
)

router = DefaultRouter()
router.register(r'quests', QuestViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'progress', QuestProgressViewSet)
router.register(r'completions', TaskCompletionViewSet)
router.register(r'badges', BadgeViewSet)
router.register(r'certificates', CertificateViewSet)
router.register(r'participant-skills', ParticipantSkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]