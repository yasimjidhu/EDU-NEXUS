
// Function to generate a unique color for each sender
export const getColorForSender = (senderId: string): string => {
    
    // Generate a hash from the senderId
    let hash = 0;
    for (let i = 0; i < senderId.length; i++) {
      hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to a color
    const hue = Math.abs(hash % 360);
    const saturation = 70; // Increase saturation for more vibrant colors
    const lightness = 30 + (Math.abs(hash % 20)); // Decrease lightness for darker colors
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Darker and stronger colors
  };