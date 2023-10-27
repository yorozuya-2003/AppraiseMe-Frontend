# Generated by Django 4.2.1 on 2023-10-26 16:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_work_exp_end_time_alter_work_exp_start_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profiles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('First_name', models.CharField(max_length=30)),
                ('Second_name', models.CharField(max_length=30)),
                ('DOB', models.DateField(default=datetime.datetime(2023, 10, 26, 21, 53, 36, 288924))),
                ('Gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=20)),
                ('Pronouns', models.CharField(choices=[('They/Them', 'They/Them'), ('He/Him', 'He/Him'), ('She/Her', 'She/Her')], max_length=20)),
            ],
        ),
        migrations.AlterField(
            model_name='work_exp',
            name='end_time',
            field=models.DateField(default=datetime.datetime(2023, 10, 26, 21, 53, 36, 288924)),
        ),
        migrations.AlterField(
            model_name='work_exp',
            name='start_time',
            field=models.DateField(default=datetime.datetime(2023, 10, 26, 21, 53, 36, 288924)),
        ),
    ]