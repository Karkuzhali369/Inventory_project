export const generateColors = (count) => {
    const colors = [];
    const saturation = 70;
    const lightness = 50;

    for (let i = 0; i < count; i++) {
        const hue = Math.floor((360 / count) * i); // evenly distributed
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
};