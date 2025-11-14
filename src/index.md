# Моя документация с PlantUML

## Диаграмма последовательности

### Диаграмма 1


```plantuml
@startuml
Алиса -> Боб: Привет!
Боб --> Алиса: Здравствуй!
@enduml
```

### Диаграмма 2

```plantuml
@startuml
class User {
  +String name
  +login()
}
class AuthService
User --> AuthService: использует
@enduml
```