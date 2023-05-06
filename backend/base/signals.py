from django.db.models.signals import pre_save
from django.contrib.auth.models import User

def updateUser(sender, instance, **kwargs): #functia care trimite semnalul, instance = the object
    #print('Signals triggered')
    user = instance
    if user.email != '':
        user.username = user.email

pre_save.connect(updateUser, sender = User) #mereu cand user model e updatat atunci updateaza catre user model