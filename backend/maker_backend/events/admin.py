from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'start_date', 'end_date', 'is_active', 'created_by']
    list_filter = ['is_active', 'start_date']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_date'
    raw_id_fields = ['created_by']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'location')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date', 'is_active')
        }),
        ('Management', {
            'fields': ('created_by',)
        }),
    )