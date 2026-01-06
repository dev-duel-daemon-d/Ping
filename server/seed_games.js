import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Game from './models/Game.js'

dotenv.config()

const games = [
    {
        name: "Valorant",
        logo: "https://img.icons8.com/color/144/valorant.png",
        theme: "#FF4655"
    },
    {
        name: "League of Legends",
        logo: "https://img.icons8.com/color/144/league-of-legends.png",
        theme: "#C8AA6E"
    },
    {
        name: "Counter-Strike 2",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Counter-Strike_2_logo.svg",
        theme: "#F49D1A"
    },
    {
        name: "Dota 2",
        logo: "https://img.icons8.com/color/144/dota-2.png",
        theme: "#FF3C00"
    },
    {
        name: "Overwatch 2",
        logo: "https://img.icons8.com/color/144/overwatch.png",
        theme: "#FA9C1E"
    },
    {
        name: "Apex Legends",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Apex_legends_cover.jpg/1200px-Apex_legends_cover.jpg", 
        theme: "#DA292A"
    },
    {
        name: "Rainbow Six Siege",
        logo: "https://upload.wikimedia.org/wikipedia/en/4/47/Tom_Clancy%27s_Rainbow_Six_Siege_cover_art.jpg",
        theme: "#FFFFFF"
    },
    {
        name: "Rocket League",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/1200px-Rocket_League_coverart.jpg",
        theme: "#0093FF"
    },
    {
        name: "Fortnite",
        logo: "https://img.icons8.com/color/144/fortnite.png",
        theme: "#9146FF"
    },
    {
        name: "Call of Duty",
        logo: "https://img.icons8.com/color/144/call-of-duty-modern-warfare.png",
        theme: "#98FB98"
    }
]

const seedGames = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB Connected...')

        await Game.deleteMany()
        console.log('Old games removed')

        await Game.insertMany(games)
        console.log('Games seeded successfully')

        process.exit()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedGames()