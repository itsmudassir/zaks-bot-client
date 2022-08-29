
const convertHoursToSeconds = (value) => {
    const hms = value;
    const [hours, minutes] = hms.split(':');
    const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60;
    return totalSeconds
};

const convertSecondsToHours = (value) => {
    const seconds = value;
    const totalHours = new Date(seconds * 1000).toISOString().slice(11, 19);;
    return totalHours;
};

const generateRandomNumber = (min, max) => {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor(rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

const randomTimeSeries = (min, max, numberOfRuns) => {
    let randomTimeArray = [];

    for (let i = 0; randomTimeArray.length < numberOfRuns; i++) {
        const minSecs = convertHoursToSeconds(min);
        const maxSecs = convertHoursToSeconds(max);
        const randomSeconds = generateRandomNumber(minSecs, maxSecs);
        const randomHour = convertSecondsToHours(randomSeconds);
        if (!randomTimeArray.find((index) => index == randomHour)) {
            randomTimeArray.push(randomHour)
        }
    }
    return randomTimeArray;
}

export {
    convertHoursToSeconds,
    convertSecondsToHours,
    generateRandomNumber,
    randomTimeSeries
}