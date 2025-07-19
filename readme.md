# 🏥 Backend de Agendamiento de Citas Médicas

Este servicio backend permite registrar, consultar y actualizar citas médicas para asegurados en Perú y Chile, integrando servicios de AWS como Lambda, DynamoDB, SNS, SQS y EventBridge.

## 🚀 Funcionalidades

- Registrar una cita médica (`POST /appointments`)
- Consultar citas por asegurado (`GET /appointments/{insuredId}`)
- Listar horarios disponibles (`GET /schedules`)
- Crear horarios diponibles (`POST /schedules`)

## 🛠️ Tecnologías y herramientas

- AWS Lambda
- DynamoDB
- SNS + SQS + EventBridge
- MySQL (RDS)
- Serverless Framework
- Node.js + TypeScript
- Arquitectura hexagonal
- Principios SOLID
- Swagger/OpenAPI

## 🔧 Instalación depenencias

```bash
npm install
```

📦 Despliegue

```bash
npm run deploy:dev
```

# Estructura del proyecto


```bash

src
├── application
│   ├── dtos
│   │   ├── create-appointment.input.ts
│   │   └── create-schedule.input.ts
│   └── use-cases
│       ├── create-appointment.use-case.ts
│       ├── create-schedule.use-case.ts
│       ├── get-appointment.use-case.ts
│       ├── list-available-schedule.use-case.ts
│       └── update-appointment-status.use-case.ts
├── domain
│   ├── constants
│   │   └── dynamo-prefix.enum.ts
│   ├── entities
│   │   ├── appointment.entity.ts
│   │   └── schedule.entity.ts
│   ├── ports
│   │   └── notification-service.port.ts
│   └── repositories
│       ├── appointment-repository.port.ts
│       └── schedure-repository.port.ts
├── infrastructure
│   ├── config
│   │   └── app.config.ts
│   ├── dynamodb
│   │   └── dynamo.service.ts
│   ├── eventbridge
│   │   └── eventbridge.service.ts
│   ├── lambda
│   │   ├── appointment-cl-handler.ts
│   │   └── appointment-pe-handler.ts
│   ├── mysql
│   │   ├── mysql-appointment-cl.repository.ts
│   │   ├── mysql-appointment-pe.repository.ts
│   │   ├── mysql-cl.connection.ts
│   │   └── mysql-pe.connection.ts
│   ├── repositories
│   │   ├── appointment-dynamo.repository.ts
│   │   └── schedule-dynamo.repository.ts
│   ├── sns
│   │   └── sns-notification.service.ts
│   └── sqs
├── interfaces
│   ├── controllers
│   │   ├── appointment
│   │   │   ├── create-appointment.controller.ts
│   │   │   ├── get-appointments.controller.ts
│   │   │   └── update-appointment.controller.ts
│   │   └── schedule
│   │       ├── create-schedule.controller.ts
│   │       └── get-schedule.controller.ts
│   ├── dtos
│   │   ├── appointment.schema.ts
│   │   └── schedule.schema.ts
│   └── handlers
│       ├── appointment-handler.ts
│       └── schedule-handler.ts
└── shared
    ├── response.ts
    └── zod
        └── format-zod-errors.ts
```

# Pruebas 
```bash
npm run test

```


# Variables de entorno 
```bash
DYNAMO_TABLE_NAME=
SNS_TOPIC_PE=
SNS_TOPIC_CL=
RDS_PE_HOST=
RDS_PE_PORT=
RDS_PE_USER=
RDS_PE_PASSWORD=
RDS_PE_DB=
RDS_CL_HOST=
RDS_CL_PORT=
RDS_CL_USER=
RDS_CL_PASSWORD=
RDS_CL_DB=
EVENT_BRIDGE_BUS=
EVENT_BRIDGE_DETAIL_TYPE=

```


# Documentacion

```bash
https://seguros-indra-swagger-docs.s3.us-east-1.amazonaws.com/index.html
```