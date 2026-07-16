// Station 1: Length - Interactive Webpage Logic

document.addEventListener('DOMContentLoaded', () => {
    initUnitExplorer();
    initMeasurementLab();
    initToolsCatalog();
    initQuiz();
});

// ==========================================
// 1. UNIT EXPLORER LOGIC
// ==========================================
function initUnitExplorer() {
    const slider = document.getElementById('unit-slider');
    const unitName = document.getElementById('unit-name');
    const unitScale = document.getElementById('unit-scale');
    const unitIcon = document.getElementById('unit-icon');
    const unitText = document.getElementById('unit-comparison-text');
    const labels = document.querySelectorAll('.slider-labels span');

    const unitData = {
        1: {
            name: "Millimeter (mm)",
            scale: "1 mm = 0.001 meters",
            icon: "💳",
            text: "About the thickness of a plastic credit card! Very small!"
        },
        2: {
            name: "Centimeter (cm)",
            scale: "1 cm = 0.01 meters",
            icon: "📎",
            text: "About the width of a standard paperclip! Good for daily items."
        },
        3: {
            name: "Meter (m)",
            scale: "1 meter (m) - SI Base Unit",
            icon: "🚪",
            text: "About the height of a doorknob from the floor! The standard science scale."
        },
        4: {
            name: "Kilometer (km)",
            scale: "1 km = 1,000 meters",
            icon: "🚶",
            text: "About a 10 to 12-minute walk! Great for road distances."
        }
    };

    function updateUnitDisplay(value) {
        const data = unitData[value];
        if (!data) return;

        // Update active label styling
        labels.forEach(label => {
            if (parseInt(label.getAttribute('data-val')) === parseInt(value)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });

        // Animate text changes
        unitName.style.opacity = 0;
        unitText.style.opacity = 0;

        setTimeout(() => {
            unitName.textContent = data.name;
            unitScale.textContent = data.scale;
            unitIcon.textContent = data.icon;
            unitText.textContent = data.text;

            unitName.style.opacity = 1;
            unitText.style.opacity = 1;
        }, 150);
    }

    slider.addEventListener('input', (e) => {
        updateUnitDisplay(e.target.value);
    });

    // Make labels clickable
    labels.forEach(label => {
        label.addEventListener('click', () => {
            const val = label.getAttribute('data-val');
            slider.value = val;
            updateUnitDisplay(val);
        });
    });
}

// ==========================================
// 2. MEASUREMENT SIMULATOR LOGIC
// ==========================================
function initMeasurementLab() {
    const objButtons = document.querySelectorAll('.obj-btn');
    const svgs = document.querySelectorAll('.svg-object');
    const caliperSlider = document.getElementById('c-slider');
    const sliderBar = document.getElementById('slider-bar');
    const liveValue = document.getElementById('live-value');
    const caliperRead = document.getElementById('caliper-read');
    const targetRead = document.getElementById('target-read');
    const matchStatus = document.getElementById('match-status');
    const statusBox = document.getElementById('matching-status-box');
    const checkBtn = document.getElementById('btn-check-measure');

    // Objects definitions: targetPx represents length on 0-450 scale (where 1 cm = 30px)
    const objects = {
        pencil: {
            name: "Pencil ✏️",
            targetCm: 12.0,
            targetPx: 360
        },
        coin: {
            name: "Coin 🪙",
            targetCm: 2.5,
            targetPx: 75
        },
        notebook: {
            name: "Notebook 📓",
            targetCm: 9.0,
            targetPx: 270
        }
    };

    let activeKey = 'pencil';

    function getActiveObject() {
        return objects[activeKey];
    }

    // Switch Object Handler
    objButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const objKey = btn.getAttribute('data-obj');
            if (objKey === activeKey) return;

            // Update buttons active classes
            objButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update SVG active classes
            svgs.forEach(svg => svg.classList.remove('active'));
            document.getElementById(`obj-${objKey}`).classList.add('active');

            // Reset state
            activeKey = objKey;
            caliperSlider.value = 0;
            updateCaliperPointer(0);

            // Update UI reads
            targetRead.textContent = getActiveObject().name;
            resetStatusBox();
        });
    });

    // Handle Slider Changes
    function updateCaliperPointer(val) {
        // SVG ticks range from x=25 (0 cm) to x=475 (15 cm) which is 450px wide.
        // Left percentage starts at 5% (x=25 of 500) and extends 90% (450 of 500).
        const leftPercent = 5 + (90 * (val / 450));
        sliderBar.style.left = `${leftPercent}%`;

        // Calculate length reading
        const cmValue = (val / 30).toFixed(1);
        liveValue.textContent = `${cmValue} cm`;
        caliperRead.textContent = `${cmValue} cm`;

        // Interactive status helper
        const target = getActiveObject();
        const diff = Math.abs(val - target.targetPx);

        statusBox.className = "result-box"; // Reset coloring classes

        if (val === 0) {
            matchStatus.textContent = "Align the slider!";
        } else if (diff <= 3) { // Within 1mm / 0.1 cm
            matchStatus.textContent = "Close enough! Press check.";
            statusBox.classList.add('highlight-green');
        } else if (val < target.targetPx) {
            matchStatus.textContent = "Too short! Slide further right.";
        } else {
            matchStatus.textContent = "Too long! Adjust left.";
        }
    }

    caliperSlider.addEventListener('input', (e) => {
        updateCaliperPointer(parseInt(e.target.value));
    });

    function resetStatusBox() {
        statusBox.className = "result-box";
        matchStatus.textContent = "Align the slider!";
    }

    // Verify Calibration/Measurement Button
    checkBtn.addEventListener('click', () => {
        const val = parseInt(caliperSlider.value);
        const target = getActiveObject();
        const diff = Math.abs(val - target.targetPx);

        if (diff <= 3) {
            // Success alignment
            statusBox.className = "result-box highlight-green";
            matchStatus.textContent = `Correct! It is exactly ${target.targetCm} cm!`;
            triggerConfetti();
        } else {
            // Failed alignment
            statusBox.className = "result-box highlight-red";
            matchStatus.textContent = `Keep trying! Read the ruler mark carefully.`;
            
            // Shake the SVG container
            const activeSvg = document.getElementById(`obj-${activeKey}`);
            activeSvg.classList.add('shake');
            setTimeout(() => activeSvg.classList.remove('shake'), 500);
        }
    });

    // Initialize labels
    targetRead.textContent = getActiveObject().name;
    updateCaliperPointer(0);
}

// ==========================================
// 3. TOOLS CATALOG LOGIC
// ==========================================
function initToolsCatalog() {
    const cards = document.querySelectorAll('.tool-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// ==========================================
// 4. QUIZ LOGIC
// ==========================================
function initQuiz() {
    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    const feedbackBox = document.getElementById('quiz-feedback');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackDesc = document.getElementById('feedback-desc');

    const explanations = {
        true: {
            title: "Spot on! 🎉",
            icon: "🎉",
            desc: "A Vernier Caliper is designed specifically for circular objects! Its parallel jaws securely grip the outer edges of a coin, making it easy to find the widest part (the diameter) and read with high precision (0.1 mm)."
        },
        false: {
            ruler: "Rulers are for straight lines. Trying to align a ruler flat across the exact center of a circle can easily lead to off-center errors!",
            "tape-measure": "Tape measures are flexible and bendy. They are too loose and coarse to get an accurate, precise reading on a small coin diameter.",
            micrometer: "While extremely precise, standard micrometers are meant for very thin sheets or wire thicknesses. The diameter of a typical coin is too wide to fit within the narrow range of a pocket micrometer screw gauge, making calipers the standard choice!"
        }
    };

    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isCorrect = btn.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                // Clear any previous incorrect styles
                optionBtns.forEach(b => {
                    b.classList.remove('correct', 'incorrect');
                    b.disabled = true; // Lock the choices
                });

                btn.classList.add('correct');
                
                // Show Correct Feedback
                feedbackBox.className = "quiz-feedback-box";
                feedbackIcon.textContent = explanations.true.icon;
                feedbackTitle.textContent = explanations.true.title;
                feedbackDesc.textContent = explanations.true.desc;
                feedbackBox.classList.remove('hidden');

                triggerConfetti();
            } else {
                // Mark only this option as incorrect
                btn.classList.add('incorrect');
                btn.classList.add('shake');
                setTimeout(() => btn.classList.remove('shake'), 400);

                // Find explanation key
                const textContent = btn.querySelector('.option-text').textContent;
                let explKey = 'ruler';
                if (textContent.includes("Tape")) explKey = "tape-measure";
                if (textContent.includes("Micrometer")) explKey = "micrometer";

                // Show Incorrect Feedback
                feedbackBox.className = "quiz-feedback-box incorrect-feedback";
                feedbackIcon.textContent = "❌";
                feedbackTitle.textContent = "Not quite! Try again.";
                feedbackDesc.textContent = explanations.false[explKey];
                feedbackBox.classList.remove('hidden');
            }
        });
    });
}

// ==========================================
// 5. CONFETTI FX GENERATOR
// ==========================================
function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#06b6d4', '#6366f1', '#ec4899', '#10b981', '#f4d068'];
    
    // Spawn 40 pieces of confetti
    for (let i = 0; i < 45; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Randomize positioning and animation params
        const startX = Math.random() * 100; // viewport width %
        const size = Math.random() * 8 + 4; // 4px to 12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 0.5; // up to 0.5s delay
        const duration = Math.random() * 1.5 + 1.5; // 1.5s to 3s
        
        confetti.style.left = `${startX}vw`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';

        container.appendChild(confetti);

        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000);
    }
}
