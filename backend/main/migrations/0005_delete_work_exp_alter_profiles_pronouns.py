# Generated by Django 4.2.1 on 2023-10-26 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_profiles_dob_alter_work_exp_end_time_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='work_exp',
        ),
        migrations.AlterField(
            model_name='profiles',
            name='Pronouns',
            field=models.CharField(choices=[('His/Him', 'His/Him'), ('Her/She', 'Her/She'), ('They/Their', 'They/Their'), ('other', 'other')], max_length=20),
        ),
    ]