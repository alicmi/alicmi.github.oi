import { Project, ConnectionMap, TopicConnection } from './types';

// The base URL for the raw images in your GitHub repository.
// Note: I used the '.oi' extension as provided in your link, but standard GitHub Pages repos usually end in '.io'.
// If your images don't load, check if the repo name is 'alicmi.github.io'.
const REPO_BASE_URL = "https://raw.githubusercontent.com/alicmi/alicmi.github.oi/main/images/";

export const PROJECTS: Project[] = [
    { 
        id: "p1", 
        label: "Refin(d)ing KISD", 
        img: `${REPO_BASE_URL}re()KISD1.jpg`,
        secondaryImg: `${REPO_BASE_URL}Refinding%20KISD%20Detail.jpg`, 
        text: "Every organized form of a group of people once in a while needs a moment in time to step back and reflect on their ways of working, their goals and structures. Same goes for a university, especially when there is so little structure from top to bottom like there is at KISD.\nThis Project started with the will to shape the place we care for and the feeling that there was a need for conversation. People were feeling less responsible for the place because they are lacking community, feedback and the feeling of impact and Self-efficacy. I find this very interesting because to me my university has always felt a bit like a small testing ground for societal phenomena since we can see a similar sense learned helplessness.\nTherefore we started a survey first asking people how they feel towards their design education right now, what they love about KISD and what they would like to change. We visualized the answers because of the frequent feedback of how much just talking about it had helped with the frustration that had been rising.\nTo establish a reoccurring event we partnered with an existing working group who would facilitate a yearly questionnaire and an event that works as a discussion forum where ideas, needs and wishes can be formulated. We followed the ideas of playful learning, eye level discussions and diverse design methods for the final iteration process." 
    },
    { 
        id: "p2", 
        label: "Real Life Quest", 
        img: "https://picsum.photos/seed/quest/800/600",
        secondaryImg: "https://picsum.photos/seed/quest2/800/400",
        text: "With Real Life Quest, we have designed a socio-effective concept that is brought to life in the form of an everyday app. Because we are becoming increasingly alienated from our \"Umwelt\" and less happy due to a lack of interaction, we want to promote resonance and sharpen our awareness of details and microcosms.\nOur app provides its users with playful micro-adventures in the form of spontaneous, funny, social, and educational everyday quests. We chose the symbolic image of a soap bubble for the design because it embodies the lightheartedness associated with childhood, as well as the bubbles in which we move.\nOur design is intuitive and minimalistic because we promote real time rather than screen time. The app can be operated with just a few gestures and the user interface consists of only three different screens. In addition to receiving and collecting personal quests, you can also do analog group quests with friends, create own quests and create memories together." 
    },
    { 
        id: "p3", 
        label: "Chaos Postcards", 
        img: "https://picsum.photos/seed/chaos/800/600",
        secondaryImg: "https://picsum.photos/seed/chaos2/800/400",
        text: "With this set of postcards I want to bring awareness to the topic of landscape manipulation and its consequences for the ecosystem.\nThe seemingly pretty patterns we see on earths surface often mean chaos and destruction for animals and other non human life." 
    },
    { 
        id: "p4", 
        label: "New Years Stage Design", 
        img: "https://picsum.photos/seed/stage/800/600",
        secondaryImg: "https://picsum.photos/seed/stage2/800/400",
        text: "The entire suburban culture scene of Cologne has been facing huge financial cuttings. Multiple venues have shut down due to money struggles and gentrification. The Halls of the Artist Community  “Kolbhalle” will be torn down in 2026 and they are forced out of their homes and ateliers. They need every event to be a call for help, money and awareness to their situation in order to afford to keep their community living.\nTo help with that we partnered with the “freiraum” (free space) collective Cologne in order to create an interactive stage design.  We developed a performance which turned the main floor, decorated to look like a construction site back into a space for art and culture, resisting the threat of demolition. Our centerpiece was a huge demolition ball, which revealed the mapping piece we made for the stage." 
    },
    { 
        id: "p5", 
        label: "Co-Heat Wuppertal", 
        img: "https://picsum.photos/seed/heat/800/600",
        secondaryImg: "https://picsum.photos/seed/heat2/800/400",
        text: "With our product–service system Co-Heat, we offer an approach to addressing the future of sustainable, shared energy resources in multi-party residential buildings. Following the Transition Design Guide developed by the Wuppertal Institute, we mapped out our user journey, future megatrends, and the Sustainable Development Goals our project addresses.\nIn addition to an information board and an online platform for user support, maintenance, and individual settings, we developed, based on my initial draft, a new kind of thermostat. This thermostat allows users to select a limited base temperature while still enabling additional heating through a timer-controlled function.\nOur product–service system therefore enables housing communities to collectively manage their energy consumption, encourages low energy and water use by rewarding sustainable habits, and supports property owners in meeting political climate-protection regulations." 
    },
    { 
        id: "p6", 
        label: "Lebendiges Köln", 
        img: "https://picsum.photos/seed/koln/800/600",
        secondaryImg: "https://picsum.photos/seed/koln2/800/400",
        text: "The wilderness city map Living Cologne invites you to discover the city’s shared habitat from a non-human perspective, offering an introduction to a post-anthropocentric worldview. Exploration routes and benches lead to seemingly familiar places, which can be experienced in entirely new ways through the animal stories on the website.\nHere, you can not only learn, but also share your own observations and help animals become more visible and better understood.\nI believe that recognition is the first step toward collective well-being. Paying attention to more-than-human life in our human-made cities reminds us that we are never separate from nature. We share spaces we are responsible for—and with sharing comes caring." 
    },
    { 
        id: "p7", 
        label: "Masculine Desire in Fashion", 
        img: "https://picsum.photos/seed/fashion/800/600",
        secondaryImg: "https://picsum.photos/seed/fashion2/800/400",
        text: "What is considered sexy on a masculine body?\nRealizing that I could hardly imagine anything beyond the all-too-familiar boxer shorts, this question stayed with me and pushed me to dive deeper. While there is a wide and diverse imagery of sexualized female bodies, men are often lacking a sense of being desirable.\nThe experimental goal of this project was to create fashion pieces that serve as a low-barrier invitation—and a door opener—for a variety of cisgender heterosexual male body types to embrace their own tenderness and sensuality without having to give up their identity as straight men.\nBased on a survey and an in-depth exploration of this topic, we developed clothing and accessories that function as additions to existing wardrobes. These pieces allow men to explore everyday sexiness through confidence—by accentuating attractive body parts, working with familiar comfort garments, and gently extending their comfort zones.\nWorking toward a post-dominant future, we believe that feminism opposes the suppression of all genders and strives for a world in which everyone can see themselves as desirable." 
    }
];

// Project -> Topics
export const CONNECTIONS: ConnectionMap = {
    "p1": ["Social Design", "Community Building", "Adobe InDesign", "Event Planning", "Communication Design", "Spatial Design", "Service Design", "Organisation", "Transformative Design", "Design Education", "Project Lead"],
    "p2": ["UX/UI Design", "Resonance", "Figma", "Perspective Change", "Awareness", "Business Model Canvas", "Mental Health", "Blender", "Social Design", "Social Change"],
    "p3": ["Awareness", "Communication Design", "Nature Connection", "Sustainability"],
    "p4": ["Event Design", "Stage Design", "Spatial Design", "Social Design", "Organisation"],
    "p5": ["Sustainability", "Communication Design", "Future of Living", "Social Design", "Service Design", "Cooperation", "Business Model Canvas", "Social Change"],
    "p6": ["UX/UI Design", "Nature Connection", "Perspective Change", "Canva", "More-than-human Design"],
    "p7": ["Gender Design", "Feminism", "Fashion Design", "Textile Making", "Organisation", "Project Lead", "Magazine Making", "Adobe InDesign", "Exhibition Design", "Transformative Design", "Social Change"]
};

// Map of Topic Name -> Size/Weight (2=Large Topic, 3=Medium, 4=Small)
// Project Labels are considered Size 1 (Biggest) implicitly in the Graph logic.
export const TOPIC_WEIGHTS: {[key: string]: number} = {
    "Social Design": 2,
    "Community Building": 3,
    "Adobe InDesign": 4,
    "Event Planning": 3,
    "Communication Design": 2,
    "Spatial Design": 2,
    "Service Design": 2,
    "Organisation": 3,
    "Transformative Design": 2,
    "Design Education": 3,
    "UX/UI Design": 4,
    "Resonance": 3,
    "Figma": 4,
    "Perspective Change": 3,
    "Awareness": 3,
    "Business Model Canvas": 4,
    "Mental Health": 3,
    "Blender": 4,
    "Social Change": 3,
    "Nature Connection": 3,
    "Sustainability": 3,
    "Event Design": 2,
    "Stage Design": 2,
    "Future of Living": 3,
    "Cooperation": 3,
    "Canva": 4,
    "More-than-human Design": 2,
    "Gender Design": 2,
    "Feminism": 3,
    "Fashion Design": 2,
    "Textile Making": 4,
    "Project Lead": 4,
    "Magazine Making": 4,
    "Exhibition Design": 2
};

// Topic <-> Topic (Direct connections between concepts)
export const TOPIC_CONNECTIONS: TopicConnection[] = [
    // Social Design connections
    { source: "Social Design", target: "Community Building" },
    { source: "Social Design", target: "Sustainability" },
    { source: "Social Design", target: "Mental Health" },
    { source: "Social Design", target: "Awareness" },
    { source: "Social Design", target: "Social Change" },
    
    // Sustainability connections
    { source: "Sustainability", target: "Nature Connection" },
    { source: "Sustainability", target: "Social Design" }, 
    { source: "Sustainability", target: "Cooperation" },
    { source: "Sustainability", target: "Community Building" },
    { source: "Sustainability", target: "Awareness" },
    { source: "Sustainability", target: "More-than-human Design" },
    { source: "Sustainability", target: "Social Change" },

    // Nature Connection connections
    { source: "Nature Connection", target: "Awareness" },
    { source: "Nature Connection", target: "More-than-human Design" },
    { source: "Nature Connection", target: "Sustainability" },

    // Tool connections
    { source: "Figma", target: "UX/UI Design" },
    { source: "Adobe InDesign", target: "Communication Design" },

    // Gender Design connections
    { source: "Gender Design", target: "Feminism" },
    { source: "Gender Design", target: "Social Design" },

    // Stage/Event Design connections
    { source: "Stage Design", target: "Spatial Design" },
    { source: "Stage Design", target: "Event Design" },
    
    // Event Design connections
    { source: "Event Design", target: "Social Change" },
    { source: "Event Design", target: "Social Design" },
    { source: "Event Design", target: "Service Design" },
    { source: "Event Design", target: "Organisation" }
];

export const TOPICS = Object.keys(TOPIC_WEIGHTS);
