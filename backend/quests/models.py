from django.db import models
from events.models import Event
from skills.models import Skill
from users.models import User
import uuid

class Quest(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='quests')
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    ai_generated_story = models.TextField(blank=True)
    skills = models.ManyToManyField(Skill, related_name='quests')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quests_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'quests'
    
    def __str__(self):
        return self.title

class Task(models.Model):
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.IntegerField(default=0)
    ai_generated_context = models.TextField(blank=True)
    qr_code = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.quest.title} - {self.title}"

class QuestProgress(models.Model):
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quest_progress')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='progress')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'quest_progress'
        unique_together = ['participant', 'quest']

class TaskCompletion(models.Model):
    progress = models.ForeignKey(QuestProgress, on_delete=models.CASCADE, related_name='task_completions')
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    validated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='validations')
    
    class Meta:
        db_table = 'task_completions'
        unique_together = ['progress', 'task']

class Badge(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='badge')
    name = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.URLField(blank=True)
    
    class Meta:
        db_table = 'badges'

class Certificate(models.Model):
    quest = models.OneToOneField(Quest, on_delete=models.CASCADE, related_name='certificate')
    template = models.TextField()  # HTML template for certificate
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificates'

class ParticipantSkill(models.Model):
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='acquired_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    acquired_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'participant_skills'
        unique_together = ['participant', 'skill', 'quest']