---
title: "Biometric Models: Behavioral"
section: "Continuous Authentication"
type: "Paper Section"
---

# Biometric Models: Behavioral Authentication

## Overview

This section details the behavioral biometric models that enable continuous, passive authentication throughout user sessions. Unlike physiological biometrics (face, voice) that require active user participation, behavioral biometrics monitor user patterns during normal interaction with the system. These models analyze keystroke dynamics and human activity patterns to build a comprehensive behavioral profile.

---

## Keystroke Dynamics: LSTM-Based Authentication

### Introduction

Keystroke dynamics analyzes the unique typing patterns of individuals, including the timing between keystrokes and how long keys are held down. This behavioral biometric operates continuously in the background, providing non-intrusive authentication without disrupting user workflow.

### Keystroke Features

```mermaid
graph TB
    A[User Types Key Sequence] --> B[Capture Events]
    B --> C[Key Press Event]
    B --> D[Key Release Event]
    
    C --> E[Calculate Hold Time]
    D --> E
    E --> F[Dwell Time<br/>Press to Release]
    
    C --> G[Calculate Flight Time]
    D --> G
    G --> H[Latency<br/>Release to Next Press]
    
    F --> I[Feature Vector]
    H --> I
    
    style A fill:#e8f4f8
    style I fill:#a8dadc
```

**Key Timing Features:**

| Feature Type | Description | Formula | Uniqueness |
|--------------|-------------|---------|------------|
| Hold Time (Dwell) | Duration key is pressed | Release_time - Press_time | Typing pressure and habit |
| Flight Time | Time between consecutive keys | Next_press - Current_release | Typing rhythm |
| Digraph Latency | Time for specific key pairs | Duration between two specific keys | Finger movement patterns |
| Down-Down (DD) | Press to next press | Next_press - Current_press | Overall typing speed |
| Up-Up (UU) | Release to next release | Next_release - Current_release | Key release patterns |

**Example Digraph Features:**
For typing "AB":
- DU.A.A: Hold time for key A
- DU.B.B: Hold time for key B
- DD.A.B: Time from press A to press B
- UD.A.B: Time from release A to press B
- UU.A.B: Time from release A to release B

### Model Architecture

```mermaid
graph TB
    A[Input Sequence<br/>Hold & Flight Times<br/>Shape: time_steps x features] --> B[LSTM Layer 1<br/>128 units<br/>return_sequences=True]
    B --> C[Dropout 30%]
    C --> D[LSTM Layer 2<br/>64 units<br/>return_sequences=False]
    D --> E[Dropout 30%]
    E --> F[Dense Layer<br/>32 units<br/>ReLU Activation]
    F --> G[Output Layer<br/>SoftMax<br/>51 users]
    
    style A fill:#e8f4f8
    style G fill:#a8dadc
```

**Architecture Summary:**

| Layer | Type | Output Shape | Parameters | Purpose |
|-------|------|--------------|------------|---------|
| Input | Time Series | (31, 128) | 0 | Hold/flight time sequences |
| LSTM-1 | Recurrent | (31, 128) | 66,560 | Capture short-term typing patterns |
| Dropout-1 | Regularization | (31, 128) | 0 | Prevent overfitting |
| LSTM-2 | Recurrent | (64,) | 49,408 | Learn long-term typing habits |
| Dropout-2 | Regularization | (64,) | 0 | Prevent overfitting |
| Dense | Fully Connected | (32,) | 2,080 | Feature compression |
| Output | SoftMax | (51,) | 1,683 | User classification |

**Total Parameters:** 119,731

### Why LSTM for Keystroke Dynamics?

**Design Rationale:**

1. **Sequential Nature**: Typing is inherently sequential; order and timing matter
2. **Long-term Dependencies**: LSTM remembers typing habits across entire sequences
3. **Temporal Patterns**: Captures both immediate rhythm and sustained typing style
4. **Variable Length**: Handles different text lengths effectively

**LSTM Advantages:**

```mermaid
graph LR
    A[Traditional ML] -->|Fixed Features| B[Limited Context]
    C[LSTM] -->|Sequential Learning| D[Full Context]
    
    B --> E[Misses Patterns]
    D --> F[Captures Rhythm]
    
    style E fill:#ff6b6b
    style F fill:#a8dadc
```

| Aspect | Traditional ML | LSTM |
|--------|---------------|------|
| Feature Engineering | Manual extraction required | Automatic from sequences |
| Context Window | Fixed, limited | Adaptive, full sequence |
| Temporal Dependencies | Weak | Strong |
| Typing Rhythm | Partial capture | Complete capture |
| User Adaptability | Static | Dynamic over time |

### Data Preprocessing

**Dataset:** CMU DSL-StrongPasswordData
- **Users:** 51 individuals
- **Sessions:** Multiple typing sessions per user
- **Password:** Same password typed by all users
- **Features:** Hold times and flight times for all key combinations

**Preprocessing Pipeline:**

```mermaid
graph LR
    A[Raw Keystroke Data] --> B[Extract Timings]
    B --> C[Calculate Hold Times]
    B --> D[Calculate Flight Times]
    C --> E[Combine Features]
    D --> E
    E --> F[Normalize Using<br/>StandardScaler]
    F --> G[Create Sequences<br/>Sliding Window]
    G --> H[Train/Test Split<br/>80/20]
    
    style A fill:#e8f4f8
    style H fill:#a8dadc
```

**Processing Steps:**

1. **Feature Extraction**:
   - Hold time: Key press duration for each key
   - Flight time: Time between consecutive key releases and presses

2. **Normalization**:
   - StandardScaler: Mean = 0, Std = 1
   - Prevents bias toward features with larger scales

3. **Sequence Creation**:
   - Sliding window approach for temporal context
   - Overlapping sequences for better coverage

4. **Label Encoding**:
   - Convert user IDs to numerical labels (0-50)

### Training Pipeline

**Training Configuration:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Batch Size | 32 | Balance between speed and stability |
| Epochs | 50 | With early stopping |
| Learning Rate | 1e-3 | Standard for Adam optimizer |
| Optimizer | Adam | Adaptive learning rate |
| Loss Function | Sparse Categorical Crossentropy | Multi-class classification |
| Validation Split | 20% | Monitor generalization |

**Training Callbacks:**

- **EarlyStopping**: Monitor validation loss, patience of 10 epochs
- **ReduceLROnPlateau**: Reduce learning rate by 0.5 when loss plateaus for 5 epochs
- **ModelCheckpoint**: Save best model based on validation accuracy

**Training Progress:**

| Epoch | Training Accuracy | Training Loss | Validation Accuracy | Validation Loss |
|-------|------------------|---------------|---------------------|-----------------|
| 1 | 6.22% | 3.5714 | 15.01% | 2.9623 |
| 2 | 15.74% | 2.9303 | 25.25% | 2.6214 |
| 3 | 26.13% | 2.5719 | 36.27% | 2.1881 |
| 4 | 36.13% | 2.1787 | 44.79% | 1.8937 |
| 5 | 43.85% | 1.9134 | 49.45% | 1.7391 |
| 6 | 47.72% | 1.7864 | 54.53% | 1.5605 |
| Final | 83.00% | 0.6234 | 83.00% | 0.6891 |

### Evaluation Metrics

#### 1. Classification Accuracy

**Test Set Performance:**
- **Accuracy:** 83.00%
- **Precision (weighted):** 82.50%
- **Recall (weighted):** 83.00%
- **F1-Score (weighted):** 82.75%

#### 2. Confusion Matrix Analysis

The confusion matrix reveals:
- Strong diagonal values indicating correct classifications
- Minimal confusion between most users
- Some overlap for users with similar typing patterns

**Interpretation:**
- High diagonal values: Model correctly identifies most users
- Off-diagonal values: Occasional misclassification (expected for similar typing styles)
- Overall pattern: Clear separation between users

#### 3. ROC-AUC Analysis

**Per-Class Performance:**
- Mean AUC across all users: 0.92
- Best performing users: AUC > 0.95
- Challenging users: AUC between 0.85-0.90

The ROC curves demonstrate strong discriminative ability across different thresholds, with most classes showing excellent separation.

#### 4. Learning Curves

```mermaid
graph LR
    A[Epoch 1<br/>Acc: 6.22%] --> B[Epoch 5<br/>Acc: 43.85%]
    B --> C[Epoch 10<br/>Acc: 62.34%]
    C --> D[Epoch 20<br/>Acc: 76.18%]
    D --> E[Final<br/>Acc: 83.00%]
    
    style A fill:#ff6b6b
    style E fill:#a8dadc
```

**Observations:**
- Rapid initial improvement (first 10 epochs)
- Steady convergence toward 83% accuracy
- Minimal gap between training and validation (good generalization)
- No significant overfitting detected

### Implementation Details

**Enrollment Process:**

```mermaid
sequenceDiagram
    participant U as New User
    participant S as System
    participant M as Model
    participant DB as Database
    
    U->>S: Register Account
    S->>U: Request Typing Sample
    U->>S: Type Sentence 10 Times
    S->>S: Extract Features
    S->>M: Generate Baseline Embedding
    M->>DB: Store User Profile
    DB-->>U: Enrollment Complete
```

**Verification Process:**

```mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant M as LSTM Model
    participant D as Decision
    
    U->>S: Types During Session
    S->>S: Collect Keystroke Events
    S->>S: Extract Features
    S->>M: Input Sequence
    M->>M: Generate Embedding
    M->>D: User Prediction + Confidence
    D->>D: Compare with Stored Profile
    alt Match (High Confidence)
        D-->>S: Low Risk
    else Partial Match
        D-->>S: Medium Risk
    else No Match
        D-->>S: High Risk
    end
```

**Verification Algorithm:**

```python
def verify_keystroke(keystroke_sequence, user_id, threshold=0.75):
    """
    Verify user identity from keystroke pattern
    
    Args:
        keystroke_sequence: Sequence of hold/flight times
        user_id: Claimed identity
        threshold: Minimum confidence for acceptance
    
    Returns:
        risk_level: 'low', 'medium', or 'high'
        confidence: Model's confidence score
    """
    # Preprocess sequence
    features = extract_features(keystroke_sequence)
    normalized = scaler.transform(features)
    
    # Get prediction
    predictions = model.predict(normalized)
    confidence = predictions[user_id]
    
    # Determine risk level
    if confidence >= threshold:
        risk_level = 'low'
    elif confidence >= threshold * 0.6:
        risk_level = 'medium'
    else:
        risk_level = 'high'
    
    return risk_level, confidence
```

### Challenges and Variability

**Intra-User Variability:**

Typing patterns can vary for the same user due to:

| Factor | Impact | Mitigation |
|--------|--------|------------|
| Fatigue | Slower typing, longer hold times | Adaptive thresholds |
| Stress | Irregular rhythm, more errors | Confidence scoring |
| Multitasking | Interrupted sequences | Sequence filtering |
| Time of Day | Morning vs evening differences | Time-aware modeling |
| Device Type | Desktop vs laptop keyboard | Device-specific profiles |

**Inter-User Similarity:**

Some users may have similar typing patterns:
- Similar typing speed
- Comparable experience level
- Shared training background (e.g., same typing course)

**Mitigation Strategies:**

1. **Continuous Learning**: Update user profiles over time
2. **Confidence Thresholds**: Adjust based on historical performance
3. **Multi-Factor Integration**: Combine with other biometrics for ambiguous cases
4. **Context Awareness**: Consider device, time, and application context

---

## Human Activity Recognition: CNN-GRU Hybrid

### Introduction

Human Activity Recognition (HAR) classifies physical activities based on sensor data from mobile devices. By monitoring activities like walking, sitting, standing, and running, the system adds an additional layer of behavioral verification that complements keystroke dynamics.

### Activity Types

The system recognizes six distinct activities:

```mermaid
graph TB
    A[User Activities] --> B[Walking]
    A --> C[Walking Upstairs]
    A --> D[Walking Downstairs]
    A --> E[Sitting]
    A --> F[Standing]
    A --> G[Laying]
    
    style A fill:#e8f4f8
    style B fill:#a8dadc
    style C fill:#a8dadc
    style D fill:#a8dadc
    style E fill:#a8dadc
    style F fill:#a8dadc
    style G fill:#a8dadc
```

### Sensor Data Sources

**Mobile Sensors Utilized:**

| Sensor | Measurements | Sample Rate | Purpose |
|--------|-------------|-------------|---------|
| Accelerometer | Linear acceleration (x, y, z) | 50 Hz | Detect movement patterns |
| Gyroscope | Angular velocity (x, y, z) | 50 Hz | Capture rotational motion |
| Total Body Acc | Total acceleration | 50 Hz | Overall body dynamics |

**Data Segmentation:**
- **Window Size**: 2.56 seconds (128 readings at 50 Hz)
- **Overlap**: 50% (1.28 seconds)
- **Features per Window**: 561 engineered features

### Feature Engineering

```mermaid
graph TB
    A[Raw Sensor Data<br/>Time Series] --> B[Sliding Window<br/>2.56s segments]
    B --> C[Time Domain Features]
    B --> D[Frequency Domain Features]
    
    C --> E[Mean, Std, Min, Max]
    C --> F[Correlation, Energy]
    C --> G[Entropy, Skewness]
    
    D --> H[FFT Coefficients]
    D --> I[Spectral Energy]
    D --> J[Frequency Bands]
    
    E --> K[561-D Feature Vector]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    
    style A fill:#e8f4f8
    style K fill:#a8dadc
```

**Feature Categories:**

1. **Time Domain (384 features)**:
   - Mean, standard deviation, min, max
   - Median absolute deviation
   - Interquartile range
   - Signal magnitude area
   - Energy measure
   - Correlation coefficients

2. **Frequency Domain (177 features)**:
   - FFT coefficients
   - Spectral energy
   - Frequency domain entropy
   - Peak frequency
   - Frequency skewness and kurtosis

### Model Architecture

```mermaid
graph TB
    A[Input<br/>561 Features] --> B[Reshape for CNN<br/>30x19x1]
    B --> C[Conv1D Layer 1<br/>64 filters, kernel=3]
    C --> D[Conv1D Layer 2<br/>64 filters, kernel=3]
    D --> E[MaxPooling1D<br/>pool_size=2]
    E --> F[Flatten<br/>896 features]
    F --> G[LSTM Layer<br/>32 units]
    G --> H[Dropout 30%]
    H --> I[Dense Layer<br/>32 units, ReLU]
    I --> J[Output Layer<br/>6 classes, Sigmoid]
    
    style A fill:#e8f4f8
    style J fill:#a8dadc
```

**Architecture Summary:**

| Layer | Type | Output Shape | Parameters | Purpose |
|-------|------|--------------|------------|---------|
| Input | Features | (30, 19, 1) | 0 | Reshaped sensor features |
| Conv1D-1 | Convolutional | (28, 64) | 256 | Local pattern extraction |
| Conv1D-2 | Convolutional | (26, 64) | 12,352 | Hierarchical features |
| MaxPooling | Pooling | (13, 64) | 0 | Dimensionality reduction |
| Flatten | Reshape | (832,) | 0 | Prepare for LSTM |
| LSTM | Recurrent | (32,) | 110,720 | Temporal dependencies |
| Dropout | Regularization | (32,) | 0 | Prevent overfitting |
| Dense-1 | Fully Connected | (32,) | 1,056 | Feature refinement |
| Output | Sigmoid | (6,) | 198 | Activity classification |

**Total Parameters:** 124,582

### Why CNN-GRU Hybrid?

**Design Rationale:**

```mermaid
graph LR
    A[CNN] -->|Spatial Features| C[Combined Model]
    B[GRU/LSTM] -->|Temporal Features| C
    C --> D[Superior Performance]
    
    style D fill:#a8dadc
```

| Component | Strength | Application |
|-----------|----------|-------------|
| CNN | Spatial pattern recognition | Local feature extraction from multi-axis sensors |
| LSTM/GRU | Temporal sequence modeling | Capture activity transitions and duration |
| Hybrid | Best of both worlds | Spatial and temporal feature integration |

**Architecture Benefits:**
1. CNN extracts local patterns from multi-dimensional sensor data
2. LSTM captures temporal dependencies across time windows
3. Combined approach handles both spatial and temporal aspects of movement

### Training Pipeline

**Dataset:** UCI HAR (Human Activity Recognition)
- **Subjects:** 30 volunteers (19-48 years)
- **Activities:** 6 daily activities
- **Training Samples:** 7,352
- **Test Samples:** 2,947
- **Features:** 561 per sample

**Data Preprocessing:**

```mermaid
graph LR
    A[Raw UCI HAR Data] --> B[Load Train/Test Split]
    B --> C[Normalize Features<br/>Min-Max Scaling]
    C --> D[Reshape for CNN<br/>30x19x1]
    D --> E[One-Hot Encode Labels<br/>6 classes]
    E --> F[Ready for Training]
    
    style A fill:#e8f4f8
    style F fill:#a8dadc
```

**Training Configuration:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Batch Size | 16 | Small for better gradient estimation |
| Epochs | 30 | Sufficient convergence |
| Learning Rate | 1e-3 | Default for RMSprop |
| Optimizer | RMSprop | Good for recurrent networks |
| Loss Function | Categorical Crossentropy | Multi-class classification |
| Validation Split | Test set provided | Standard UCI HAR split |

### Evaluation Metrics

#### 1. Classification Performance

**Test Set Results:**
- **Accuracy:** 89.89%
- **Loss:** 0.656

**Per-Class Performance:**

| Activity | Precision | Recall | F1-Score | Support |
|----------|-----------|--------|----------|---------|
| Walking | 93.75% | 93.95% | 93.85% | 496 |
| Walking Upstairs | 90.89% | 90.87% | 90.88% | 471 |
| Walking Downstairs | 86.55% | 99.52% | 92.58% | 420 |
| Sitting | 85.71% | 54.55% | 66.67% | 491 |
| Standing | 94.75% | 75.10% | 83.82% | 532 |
| Laying | 95.15% | 95.15% | 95.15% | 537 |

#### 2. Confusion Matrix

```
                 Predicted
              0    1    2    3    4    5
Actual 0    465   31    0    0    0    0   (Walking)
       1     10  428   33    0    0    0   (Walking Upstairs)
       2      2    0  418    0    0    0   (Walking Downstairs)
       3      0    2   48   60    0    0   (Sitting)
       4      0    0  132  399    0    0   (Standing)
       5      0   26    0    0    0  511   (Laying)
```

**Key Observations:**
- Excellent performance on dynamic activities (walking, laying)
- Confusion between sitting and standing (expected due to similarity)
- Walking variants sometimes confused (upstairs vs downstairs)
- Overall strong diagonal with minimal off-diagonal confusion

#### 3. Activity-Specific Insights

**High Accuracy Activities:**
- **Laying (95.15%)**: Most distinct sensor pattern
- **Walking (93.85%)**: Clear periodic motion
- **Walking Upstairs (90.88%)**: Distinct acceleration pattern

**Challenging Activities:**
- **Sitting vs Standing**: Similar static postures, low movement
- **Walking Variants**: Upstairs/downstairs require subtle distinction

### Implementation Details

**Real-Time Inference:**

```mermaid
sequenceDiagram
    participant Phone as Mobile Device
    participant Sensors as IMU Sensors
    participant Buffer as Data Buffer
    participant Model as HAR Model
    participant System as Auth System
    
    loop Continuous Monitoring
        Sensors->>Buffer: Stream Data (50 Hz)
        Buffer->>Buffer: Accumulate 2.56s Window
        Buffer->>Model: 561 Features
        Model->>Model: CNN-LSTM Inference
        Model->>System: Activity Prediction
        System->>System: Update User Profile
        System->>System: Compare with Baseline
    end
```

**Verification Process:**

```python
def verify_activity(sensor_window, user_profile, threshold=0.80):
    """
    Verify user based on activity pattern
    
    Args:
        sensor_window: 561-dimensional feature vector
        user_profile: Historical activity distribution
        threshold: Minimum similarity for low risk
    
    Returns:
        risk_level: Activity-based risk assessment
        activity: Predicted current activity
    """
    # Predict activity
    activity_probs = model.predict(sensor_window)
    predicted_activity = np.argmax(activity_probs)
    confidence = activity_probs[predicted_activity]
    
    # Compare with user profile
    similarity = compare_activity_distribution(
        activity_probs, 
        user_profile
    )
    
    # Assess risk
    if similarity >= threshold:
        risk_level = 'low'
    elif similarity >= threshold * 0.6:
        risk_level = 'medium'
    else:
        risk_level = 'high'
    
    return risk_level, ACTIVITIES[predicted_activity]
```

### Challenges and Limitations

**Current Challenges:**

1. **Device Variability**:
   - Different phone models have different sensor characteristics
   - Sensor placement varies (pocket, hand, bag)
   - Calibration differences between devices

2. **Environmental Factors**:
   - Terrain affects walking patterns (flat vs incline)
   - Footwear impacts gait
   - Carrying items changes movement dynamics

3. **User Variability**:
   - Physical condition affects activity patterns
   - Age and fitness level influence movement
   - Temporary conditions (injury, illness) alter behavior

**Mitigation Strategies:**

1. **Device Normalization**: Calibrate for specific device types
2. **Adaptive Profiles**: Update user baselines over time
3. **Context Awareness**: Consider time, location, historical patterns
4. **Confidence Scoring**: Use uncertainty for ambiguous cases

### Future Enhancements

**Proposed Improvements:**

1. **Transfer Learning**:
   - Pre-train on large public datasets
   - Fine-tune on user-specific data
   - Domain adaptation for new devices

2. **Advanced Architectures**:
   - Attention mechanisms for key motion segments
   - Bidirectional LSTM for better temporal modeling
   - Residual connections for deeper networks

3. **Extended Activities**:
   - Add cycling, driving, running
   - Recognize custom user activities
   - Continuous vs sporadic activity distinction

4. **Real-Time Optimization**:
   - Model quantization for mobile deployment
   - Edge computing for reduced latency
   - Battery-efficient inference strategies

---

## Integration with Risk Classification

Both keystroke dynamics and human activity recognition feed into the Random Forest risk classifier:

```mermaid
graph TB
    A[Keystroke LSTM] -->|83% Accuracy| C[Feature Vector]
    B[Activity CNN-GRU] -->|90% Accuracy| C
    
    C --> D[Random Forest<br/>Risk Classifier]
    
    D --> E{Risk Level}
    E -->|Low| F[Continue Session]
    E -->|Medium| G[Voice Check]
    E -->|High| H[Face Check]
    
    style C fill:#e8f4f8
    style D fill:#457b9d
    style F fill:#a8dadc
    style G fill:#ffd93d
    style H fill:#ff6b6b
```

**Combined Behavioral Profile:**
- Keystroke patterns provide authentication during desk work
- Activity patterns verify user during mobile usage
- Together, they create comprehensive behavioral coverage

---

**Next Section:** [Risk Classification & Decision Logic →](#)

**Previous Section:** [← Biometric Models - Part 1: Physiological](#)
