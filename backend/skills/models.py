from django.db import models

class Skill(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skills'
    
    def __str__(self):
        return self.name