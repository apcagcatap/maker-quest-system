from django.contrib import admin
from .models import (
    Quest, Task, QuestProgress, TaskCompletion, 
    Badge, Certificate, ParticipantSkill
)

class TaskInline(admin.TabularInline):
    model = Task
    extra = 1
    fields = ['title', 'description', 'order', 'qr_code']
    readonly_fields = ['qr_code']

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ['title', 'event', 'difficulty', 'created_by', 'created_at']
    list_filter = ['difficulty', 'event', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['skills']
    raw_id_fields = ['event', 'created_by']
    inlines = [TaskInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('event', 'title', 'description', 'difficulty')
        }),
        ('AI Generated Content', {
            'fields': ('ai_generated_story',),
            'classes': ('collapse',)
        }),
        ('Skills', {
            'fields': ('skills',)
        }),
        ('Management', {
            'fields': ('created_by',)
        }),
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'quest', 'order', 'qr_code']
    list_filter = ['quest']
    search_fields = ['title', 'description']
    ordering = ['quest', 'order']
    readonly_fields = ['qr_code']
    raw_id_fields = ['quest']

@admin.register(QuestProgress)
class QuestProgressAdmin(admin.ModelAdmin):
    list_display = ['participant', 'quest', 'is_completed', 'started_at', 'completed_at']
    list_filter = ['is_completed', 'started_at']
    search_fields = ['participant__username', 'quest__title']
    raw_id_fields = ['participant', 'quest']
    readonly_fields = ['started_at']

@admin.register(TaskCompletion)
class TaskCompletionAdmin(admin.ModelAdmin):
    list_display = ['task', 'progress', 'completed_at', 'validated_by']
    list_filter = ['completed_at']
    search_fields = ['task__title', 'progress__participant__username']
    raw_id_fields = ['progress', 'task', 'validated_by']
    readonly_fields = ['completed_at']

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'task']
    search_fields = ['name', 'description']
    raw_id_fields = ['task']

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['quest', 'created_at']
    search_fields = ['quest__title']
    raw_id_fields = ['quest']
    readonly_fields = ['created_at']

@admin.register(ParticipantSkill)
class ParticipantSkillAdmin(admin.ModelAdmin):
    list_display = ['participant', 'skill', 'quest', 'acquired_at']
    list_filter = ['skill', 'acquired_at']
    search_fields = ['participant__username', 'skill__name']
    raw_id_fields = ['participant', 'skill', 'quest']
    readonly_fields = ['acquired_at']