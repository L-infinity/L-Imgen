// DOM Elements
const promptInput = document.getElementById('prompt');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const styleSelect = document.getElementById('style');
const sizeSelect = document.getElementById('size');
const generatedImage = document.getElementById('generatedImage');
const loadingElement = document.getElementById('loading');
const placeholderElement = document.getElementById('placeholder');
const promptChips = document.querySelectorAll('.prompt-chip');

// Character counter
promptInput.addEventListener('input', () => {
    charCount.textContent = promptInput.value.length;
});

// Sample prompt chips
promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        promptInput.value = chip.textContent;
        charCount.textContent = promptInput.value.length;
    });
});

// Generate image
generateBtn.addEventListener('click', generateImage);
regenerateBtn.addEventListener('click', generateImage);

async function generateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }
    
    // Show loading, hide placeholder
    loadingElement.style.display = 'flex';
    placeholderElement.style.display = 'none';
    generatedImage.style.display = 'none';
    
    // Disable buttons during generation
    generateBtn.disabled = true;
    downloadBtn.disabled = true;
    regenerateBtn.disabled = true;
    
    try {
        // Build image URL
        const style = styleSelect.value;
        const size = sizeSelect.value;
        const [width, height] = size.split('x');
        
        // Encode prompt
        let encodedPrompt = encodeURIComponent(prompt);
        if (style) {
            encodedPrompt += ` ${style}`;
        }
        
        // Use image generation service
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true`;
        
        // Load image
        await loadImage(imageUrl);
        
        // Enable buttons
        downloadBtn.disabled = false;
        regenerateBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Error generating image. Please try again.');
    } finally {
        // Re-enable generate button
        generateBtn.disabled = false;
        loadingElement.style.display = 'none';
    }
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        generatedImage.onload = () => {
            generatedImage.style.display = 'block';
            placeholderElement.style.display = 'none';
            resolve();
        };
        
        generatedImage.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        // Set src to trigger load
        generatedImage.src = url;
        
        // Add timestamp to avoid caching issues
        generatedImage.src = url + '&t=' + Date.now();
    });
}

// Download image
downloadBtn.addEventListener('click', async () => {
    if (!generatedImage.src || generatedImage.src.includes('placeholder')) {
        alert('No image to download');
        return;
    }
    
    try {
        const response = await fetch(generatedImage.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `limgen-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    charCount.textContent = promptInput.value.length;
});