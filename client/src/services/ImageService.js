// Service for handling meal images - automatic assignment and manual upload
export class ImageService {
    static instance;
    // Predefined image mappings for common Ethiopian and international foods
    static FOOD_IMAGE_MAPPINGS = {
        // Ethiopian Traditional Foods
        'genfo': '/images/meals/ethiopian/genfo.jpg',
        'barley flour': '/images/meals/ethiopian/genfo.jpg',
        'fatira': '/images/meals/ethiopian/fatira.jpg',
        'injera': '/images/meals/ethiopian/injera.jpg',
        'kitfo': '/images/meals/ethiopian/kitfo.jpg',
        'doro wat': '/images/meals/ethiopian/doro-wat.jpg',
        'shiro': '/images/meals/ethiopian/shiro.jpg',
        'gomen': '/images/meals/ethiopian/gomen.jpg',
        'tibs': '/images/meals/ethiopian/tibs.jpg',
        'berbere': '/images/meals/ethiopian/berbere.jpg',
        'dallen': '/images/meals/ethiopian/dallen.jpg',
        'abish': '/images/meals/ethiopian/abish.jpg',
        'shinbra': '/images/meals/ethiopian/shinbra.jpg',
        'ambaza': '/images/meals/ethiopian/ambaza.jpg',
        'beraperat': '/images/meals/ethiopian/beraperat.jpg',
        'kashya': '/images/meals/ethiopian/kashya.jpg',
        'ititu': '/images/meals/ethiopian/ititu.jpg',
        'zengada': '/images/meals/ethiopian/zengada.jpg',
        'ajaja': '/images/meals/ethiopian/ajaja.jpg',
        'datta': '/images/meals/ethiopian/datta.jpg',
        'kocho': '/images/meals/ethiopian/kocho.jpg',
        'misir wat': '/images/meals/ethiopian/misir-wat.jpg',
        'atakilt wat': '/images/meals/ethiopian/atakilt-wat.jpg',
        'ayib': '/images/meals/ethiopian/ayib.jpg',
        // International Foods
        'chicken': '/images/meals/international/chicken.jpg',
        'fish': '/images/meals/international/fish.jpg',
        'beef': '/images/meals/international/beef.jpg',
        'rice': '/images/meals/international/rice.jpg',
        'quinoa': '/images/meals/international/quinoa.jpg',
        'oats': '/images/meals/international/oats.jpg',
        'avocado': '/images/meals/international/avocado.jpg',
        'eggs': '/images/meals/international/eggs.jpg',
        'salmon': '/images/meals/international/salmon.jpg',
        'vegetables': '/images/meals/international/vegetables.jpg',
        'salad': '/images/meals/international/salad.jpg',
        'soup': '/images/meals/international/soup.jpg',
        'pasta': '/images/meals/international/pasta.jpg',
        'bread': '/images/meals/international/bread.jpg',
        'yogurt': '/images/meals/international/yogurt.jpg',
        'nuts': '/images/meals/international/nuts.jpg',
        'beans': '/images/meals/international/beans.jpg',
        'lentils': '/images/meals/international/lentils.jpg',
        'tofu': '/images/meals/international/tofu.jpg',
        'turkey': '/images/meals/international/turkey.jpg',
    };
    // Fallback images for different meal types
    static FALLBACK_IMAGES = {
        ethiopian: '/images/meals/ethiopian/default-ethiopian.jpg',
        international: '/images/meals/international/default-international.jpg',
        breakfast: '/images/meals/categories/breakfast.jpg',
        lunch: '/images/meals/categories/lunch.jpg',
        dinner: '/images/meals/categories/dinner.jpg',
        snack: '/images/meals/categories/snack.jpg',
        default: '/images/meals/default-meal.jpg'
    };
    static getInstance() {
        if (!ImageService.instance) {
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }
    /**
     * Automatically suggest an image based on meal name and characteristics
     */
    suggestImage(mealName, isEthiopian = false, mealType) {
        const normalizedName = mealName.toLowerCase().trim();
        // First, try exact matches in our mapping
        for (const [keyword, imagePath] of Object.entries(ImageService.FOOD_IMAGE_MAPPINGS)) {
            if (normalizedName.includes(keyword)) {
                return imagePath;
            }
        }
        // If no exact match, use fallback based on characteristics
        if (isEthiopian) {
            return ImageService.FALLBACK_IMAGES.ethiopian;
        }
        if (mealType) {
            const fallbackKey = mealType.toLowerCase();
            if (ImageService.FALLBACK_IMAGES[fallbackKey]) {
                return ImageService.FALLBACK_IMAGES[fallbackKey];
            }
        }
        return ImageService.FALLBACK_IMAGES.default;
    }
    /**
     * Get multiple image suggestions for a meal
     */
    getImageSuggestions(mealName, isEthiopian = false) {
        const suggestions = [];
        const normalizedName = mealName.toLowerCase().trim();
        // Add exact matches
        for (const [keyword, imagePath] of Object.entries(ImageService.FOOD_IMAGE_MAPPINGS)) {
            if (normalizedName.includes(keyword)) {
                suggestions.push(imagePath);
            }
        }
        // Add fallback options
        if (isEthiopian) {
            suggestions.push(ImageService.FALLBACK_IMAGES.ethiopian);
        }
        else {
            suggestions.push(ImageService.FALLBACK_IMAGES.international);
        }
        // Add default if no suggestions
        if (suggestions.length === 0) {
            suggestions.push(ImageService.FALLBACK_IMAGES.default);
        }
        // Remove duplicates and limit to 5 suggestions
        return [...new Set(suggestions)].slice(0, 5);
    }
    /**
     * Validate if an image URL is accessible
     */
    async validateImageUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok && response.headers.get('content-type')?.startsWith('image/') === true;
        }
        catch {
            return false;
        }
    }
    /**
     * Upload image to storage (placeholder for future implementation)
     */
    async uploadImage(file, mealId) {
        // TODO: Implement actual file upload to Supabase Storage or other service
        // For now, return a placeholder URL
        const fileName = `meal-${mealId}-${Date.now()}.${file.name.split('.').pop()}`;
        return `/images/uploads/${fileName}`;
    }
    /**
     * Get image URL with fallback
     */
    getImageWithFallback(imageUrl, mealName, isEthiopian = false) {
        if (imageUrl && imageUrl.trim()) {
            return imageUrl;
        }
        return this.suggestImage(mealName, isEthiopian);
    }
    /**
     * Check if an image exists in our predefined mappings
     */
    hasImageMapping(mealName) {
        const normalizedName = mealName.toLowerCase().trim();
        return Object.keys(ImageService.FOOD_IMAGE_MAPPINGS).some(keyword => normalizedName.includes(keyword));
    }
    /**
     * Generate a simple placeholder image URL
     */
    generatePlaceholderImage(mealName, isEthiopian = false) {
        // For now, return a simple placeholder service URL
        const encodedName = encodeURIComponent(mealName);
        const bgColor = isEthiopian ? 'DC143C' : '4CAF50';
        const textColor = 'FFFFFF';
        // Using a placeholder service like placeholder.com or similar
        return `https://via.placeholder.com/400x300/${bgColor}/${textColor}?text=${encodedName}`;
    }
    /**
     * Get image URL with automatic placeholder generation
     */
    getImageWithPlaceholder(imageUrl, mealName, isEthiopian = false) {
        if (imageUrl && imageUrl.trim()) {
            return imageUrl;
        }
        // Try predefined mapping first
        const suggestedImage = this.suggestImage(mealName, isEthiopian);
        // If it's a fallback image that might not exist, generate placeholder
        if (suggestedImage.includes('default') || suggestedImage.includes('fallback')) {
            return this.generatePlaceholderImage(mealName, isEthiopian);
        }
        return suggestedImage;
    }
}
// Export singleton instance
export const imageService = ImageService.getInstance();
