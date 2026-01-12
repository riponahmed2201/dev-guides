# WebSockets & Channels

ট্র্যাডিশনাল HTTP রিকোয়েস্ট-রেসপন্স মডেলে সার্ভার শুধু ক্লায়েন্টের রিকোয়েস্টের জবাব দেয়। কিন্তু রিয়েল-টাইম ফিচার (যেমন: চ্যাট, লাইভ নোটিফিকেশন) এর জন্য সার্ভার থেকে ক্লায়েন্টে ডেটা পুশ করা দরকার। এর জন্য **WebSockets** এবং **Django Channels** ব্যবহার করা হয়।

## Django Channels

Django Channels, Django কে ASGI (Asynchronous Server Gateway Interface) সাপোর্ট করার ক্ষমতা দেয়, যা WebSockets এবং অন্যান্য async প্রোটোকল হ্যান্ডেল করতে পারে।

**Installation:**
```bash
pip install channels channels-redis
```

**Configuration:**
```python
# settings.py
INSTALLED_APPS = [
    'channels',
    # ...
]

ASGI_APPLICATION = 'myproject.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

## ASGI Configuration

**`asgi.py` ফাইল আপডেট করুন:**

```python
# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import myapp.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            myapp.routing.websocket_urlpatterns
        )
    ),
})
```

## WebSocket Consumer

Consumer হলো WebSocket কানেকশন হ্যান্ডেল করার ক্লাস।

```python
# myapp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
```

## Routing

```python
# myapp/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
```

## Frontend (JavaScript)

```javascript
const roomName = 'lobby';
const chatSocket = new WebSocket(
    'ws://' + window.location.host + '/ws/chat/' + roomName + '/'
);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log(data.message);
};

chatSocket.send(JSON.stringify({
    'message': 'Hello, World!'
}));
```

## Running with Daphne

Channels এর জন্য ASGI সার্ভার দরকার (যেমন: Daphne)।

```bash
pip install daphne
daphne -b 0.0.0.0 -p 8000 myproject.asgi:application
```
