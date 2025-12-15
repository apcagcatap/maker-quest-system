from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('participant', 'Participant'),
        ('facilitator', 'Facilitator'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    supabase_id = models.CharField(max_length=255, unique=True, null=True)
    
    class Meta:
        db_table = 'users'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'profiles'