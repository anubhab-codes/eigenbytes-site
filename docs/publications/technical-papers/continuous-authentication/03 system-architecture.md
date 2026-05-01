---
title: System Architecture
section: "Continuous Authentication"
type: "Paper Section"
---
# System Architecture & Overview

## Introduction

The proposed continuous authentication system introduces a novel approach that integrates keystroke dynamics and human activity recognition data from mobile and IoT devices into a unified risk assessment framework. Unlike traditional authentication that verifies identity only at login, this system continuously monitors user behavior throughout the session and dynamically escalates verification requirements based on assessed risk levels.

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Input["Data Acquisition Layer"]
        A1[Facial Camera]
        A2[Microphone]
        A3[Keyboard/Mouse]
        A4[Mobile Sensors]
        A5[Contextual Data]
    end
    
    subgraph Processing["Preprocessing Layer"]
        B1[Image Normalization]
        B2[Audio Feature Extraction]
        B3[Keystroke Pattern Analysis]
        B4[Activity Feature Engineering]
        B5[Context Aggregation]
    end
    
    subgraph Models["Authentication Models"]
        C1[Face Matcher]
        C2[Voice Matcher]
        C3[Keystroke Matcher]
        C4[Activity Recognition]
    end
    
    subgraph Decision["Risk Assessment & Decision"]
        D1[Feature Fusion]
        D2[Random Forest Classifier]
        D3[Risk Level Output]
    end
    
    subgraph Action["Action Layer"]
        E1[Low Risk: Continue]
        E2[Medium Risk: Voice Check]
        E3[High Risk: Face Check]
        E4[Deny Access]
    end
    
    A1 --> B1 --> C1
    A2 --> B2 --> C2
    A3 --> B3 --> C3
    A4 --> B4 --> C4
    A5 --> B5
    
    C3 --> D1
    C4 --> D1
    B5 --> D1
    
    D1 --> D2
    D2 --> D3
    
    D3 -->|Low| E1
    D3 -->|Medium| E2
    D3 -->|High| E3
    
    E2 -->|Pass| E1
    E2 -->|Fail| E3
    E3 -->|Pass| E1
    E3 -->|Fail| E4
```

## Core System Modules

### 1. Data Acquisition Module

The foundation of the continuous authentication system, responsible for collecting multi-modal biometric and contextual data.

**Biometric Data Sources:**
- **Facial Data**: Captured via webcam/device camera
- **Voice Data**: Recorded through microphone during natural interaction
- **Keystroke Data**: Monitoring typing patterns (hold time, flight time)
- **Activity Data**: Mobile sensors (accelerometer, gyroscope, GPS)

**Contextual Data Sources:**
- Device type and fingerprint
- IP address and geolocation
- Session duration and login time
- Network conditions
- Application usage patterns

### 2. Preprocessing Module

Transforms raw data into standardized formats suitable for machine learning models.

```mermaid
graph LR
    subgraph Facial
        A1[Raw Image] --> A2[Resize 160x160]
        A2 --> A3[Normalize Pixels]
        A3 --> A4[Face Detection]
    end
    
    subgraph Voice
        B1[Audio Stream] --> B2[Noise Reduction]
        B2 --> B3[MFCC Extraction]
        B3 --> B4[Mel Spectrogram]
    end
    
    subgraph Keystroke
        C1[Key Events] --> C2[Calculate Timings]
        C2 --> C3[Hold & Flight Times]
        C3 --> C4[Normalize Features]
    end
    
    subgraph Activity
        D1[Sensor Data] --> D2[Windowing]
        D2 --> D3[Feature Engineering]
        D3 --> D4[Normalization]
    end
```

**Processing Steps by Modality:**

| Modality | Input | Processing | Output |
|----------|-------|------------|--------|
| Face | Raw image frames | Resize, normalize, detect faces | 160x160x3 normalized arrays |
| Voice | Audio waveform | Noise reduction, MFCC extraction | Mel spectrograms (128x64) |
| Keystroke | Key press/release events | Timing calculation, normalization | Hold/flight time vectors |
| Activity | Accelerometer/gyroscope | Windowing, feature extraction | 561-dimensional feature vectors |

### 3. Matcher Modules

Specialized deep learning models for each biometric modality.

#### Face Matcher
- **Architecture**: MobileNetV2 with triplet loss
- **Function**: Generates 512-dimensional facial embeddings
- **Comparison**: Euclidean distance between embeddings
- **Threshold**: Optimized at 0.5392

#### Voice Matcher
- **Architecture**: GRU with attention mechanism
- **Function**: Creates speaker-specific voiceprints
- **Input**: Mel spectrograms (128x64)
- **Output**: Speaker classification probabilities

#### Keystroke Dynamics Matcher
- **Architecture**: Bi-directional LSTM
- **Function**: Analyzes typing rhythm and timing patterns
- **Features**: Hold time, flight time, digraph analysis
- **Output**: User-specific typing embeddings

#### Activity Recognition Matcher
- **Architecture**: CNN-GRU hybrid
- **Function**: Classifies human activities from sensor data
- **Activities**: Walking, sitting, standing, running, etc.
- **Dataset**: UCI HAR (Human Activity Recognition)

### 4. Feature Fusion Module

Integrates outputs from keystroke dynamics and activity recognition for comprehensive behavioral analysis.

```mermaid
graph TB
    A[Keystroke Features] --> C[Feature Concatenation]
    B[Activity Features] --> C
    D[Contextual Features] --> C
    C --> E[Unified Feature Vector]
    E --> F[Normalization]
    F --> G[To Risk Classifier]
    
    style E fill:#a8dadc
    style G fill:#457b9d
```

**Fusion Strategy:**
- **Level**: Feature-level fusion (early fusion)
- **Method**: Concatenation of normalized feature vectors
- **Advantage**: Captures interactions between behavioral modalities
- **Output**: Single unified representation for risk assessment

### 5. Risk Classification Module

A Random Forest classifier that categorizes authentication attempts into three risk levels.

**Input Features:**
- Keystroke dynamics embeddings
- Human activity patterns
- Contextual parameters (IP reputation, geolocation, session data)
- Login anomalies (time, frequency, duration)

**Risk Levels:**

| Risk Level | Criteria | Action Required |
|------------|----------|-----------------|
| Low | Behavior matches historical patterns | Continue session seamlessly |
| Medium | Minor deviations detected | Trigger voice verification |
| High | Significant anomalies or failed voice check | Require face verification |

### 6. Decision & Feedback Module

Manages the adaptive authentication flow based on risk assessment.

```mermaid
stateDiagram-v2
    [*] --> RiskAssessment
    RiskAssessment --> LowRisk: Normal Behavior
    RiskAssessment --> MediumRisk: Minor Deviation
    RiskAssessment --> HighRisk: Major Anomaly
    
    LowRisk --> ContinueSession
    ContinueSession --> [*]
    
    MediumRisk --> VoiceCheck
    VoiceCheck --> ContinueSession: Pass
    VoiceCheck --> FaceCheck: Fail
    
    HighRisk --> FaceCheck
    FaceCheck --> ContinueSession: Pass
    FaceCheck --> DenyAccess: Fail
    
    DenyAccess --> [*]
```

## Complete Data Flow

The system operates in a continuous loop throughout the user session:

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant K as Keystroke Module
    participant A as Activity Module
    participant R as Risk Classifier
    participant V as Voice Matcher
    participant F as Face Matcher
    
    U->>S: Login (Initial Auth)
    S->>U: Session Started
    
    loop Continuous Monitoring
        U->>K: Typing Activity
        U->>A: Physical Movement
        K->>R: Keystroke Features
        A->>R: Activity Features
        S->>R: Contextual Data
        
        R->>R: Classify Risk
        
        alt Low Risk
            R->>U: Continue Session
        else Medium Risk
            R->>V: Trigger Voice Check
            U->>V: Provide Voice Sample
            alt Voice Match
                V->>U: Continue Session
            else Voice Fail
                V->>F: Escalate to Face Check
                U->>F: Provide Face Image
                alt Face Match
                    F->>U: Continue Session
                else Face Fail
                    F->>U: Terminate Session
                end
            end
        else High Risk
            R->>F: Trigger Face Check
            U->>F: Provide Face Image
            alt Face Match
                F->>U: Continue Session
            else Face Fail
                F->>U: Terminate Session
            end
        end
    end
```

## User Experience Flow

### Web Application Workflow

```mermaid
flowchart TD
    Start([User Accesses System]) --> Register{Registered?}
    Register -->|No| Reg[Registration Process]
    Register -->|Yes| Login[Login: Email + Password]
    
    Reg --> EnrollBio[Biometric Enrollment]
    EnrollBio --> KS[Type Sentence 10x]
    KS --> Store[Store Baseline]
    Store --> Login
    
    Login --> Auth{Credentials Valid?}
    Auth -->|No| Login
    Auth -->|Yes| Session[Session Started]
    
    Session --> Monitor[Continuous Monitoring]
    Monitor --> Collect[Collect Keystroke + Activity]
    Collect --> Compare[Compare to Baseline]
    Compare --> Risk{Risk Level?}
    
    Risk -->|Low| Continue[Continue Working]
    Risk -->|Medium| Voice[Voice Verification]
    Risk -->|High| Face[Face Verification]
    
    Voice -->|Pass| Continue
    Voice -->|Fail| Face
    Face -->|Pass| Continue
    Face -->|Fail| Deny[Terminate Session]
    
    Continue --> Monitor
    Deny --> End([Session Ended])
```

## System Integration Points

### Module Interaction Overview

```mermaid
graph TB
    subgraph Frontend["User Interface Layer"]
        UI1[Web Interface]
        UI2[Camera Access]
        UI3[Microphone Access]
        UI4[Keyboard Listener]
    end
    
    subgraph Backend["Processing Backend"]
        BE1[Authentication API]
        BE2[Model Inference Engine]
        BE3[Risk Evaluation Service]
    end
    
    subgraph Storage["Data Storage"]
        DB1[User Profiles]
        DB2[Biometric Templates]
        DB3[Session Logs]
        DB4[Audit Trails]
    end
    
    subgraph Models["ML Model Services"]
        ML1[Face Model Service]
        ML2[Voice Model Service]
        ML3[Keystroke Model Service]
        ML4[Activity Model Service]
        ML5[Risk Classifier Service]
    end
    
    UI1 --> BE1
    UI2 --> ML1
    UI3 --> ML2
    UI4 --> ML3
    
    BE1 --> BE2
    BE2 --> ML1
    BE2 --> ML2
    BE2 --> ML3
    BE2 --> ML4
    
    BE2 --> BE3
    BE3 --> ML5
    
    BE1 --> DB1
    BE2 --> DB2
    BE3 --> DB3
    BE3 --> DB4
```

## Unique Aspects of the Solution

### 1. Adaptive Authentication
The system learns and evolves with user behavior over time, reducing false positives and creating a personalized security profile.

### 2. Minimal User Disruption
By using passive behavioral monitoring (keystroke and activity patterns), the system performs continuous checks without requiring active user participation unless risk is detected.

### 3. Escalating Verification
Rather than applying maximum security at all times, the system intelligently escalates authentication requirements based on detected risk, balancing security with usability.

### 4. Application-Agnostic Design
The modular architecture allows the system to be integrated into various platforms (web, mobile, desktop) without modification to core components.

### 5. Multi-Layer Security
Combining behavioral biometrics (passive) with physiological biometrics (active) creates multiple layers of defense against sophisticated attacks.

## System Requirements

### Hardware Requirements
- **Camera**: For facial recognition (minimum 720p)
- **Microphone**: For voice authentication (standard quality)
- **Input Devices**: Keyboard/mouse for keystroke dynamics
- **Mobile Sensors**: Accelerometer, gyroscope (for mobile deployment)

### Software Requirements
- **Deep Learning Frameworks**: TensorFlow 2.x or PyTorch 1.x
- **Computer Vision**: OpenCV 4.x
- **Python**: 3.8 or higher
- **Database**: SQLite (development) / PostgreSQL (production)

### Performance Targets
- **Latency**: Under 200ms for risk assessment
- **Accuracy**: Above 85% for all biometric modalities
- **False Acceptance Rate**: Below 5%
- **False Rejection Rate**: Below 10%

## Security Considerations

### Data Protection
- All biometric data encrypted at rest and in transit
- User embeddings stored instead of raw biometric data
- Compliance with GDPR and relevant privacy regulations

### Attack Resistance
- Protection against replay attacks through liveness detection
- Spoofing resistance via multi-modal verification
- Session hijacking prevention through continuous monitoring

---
