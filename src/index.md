# Моя документация с PlantUML

## Диаграммы 

### Диаграмма последовательности


```plantuml
@startuml
Алиса -> Боб: Привет!
Боб --> Алиса: Здравствуй!
@enduml
```

### Диаграмма классов

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

