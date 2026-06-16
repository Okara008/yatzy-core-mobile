import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StatsContext = createContext();

const StatsProvider = ({children}) => {
    const [playerStats, updatePlayerStats] = useState([])
    const [playerNames, setPlayerNames] = useState({p1: '', p2: ''})
    
    useEffect(() => {
        const loadData = async () => {
            let saved = await AsyncStorage.getItem("yatzy_stats")
            
            if(saved){
                try{
                    saved = JSON.parse(saved)
                }
                catch{
                    saved = []
                }
                updatePlayerStats([...saved])
            }
        }
        loadData()
    }, [])

    return(
        <StatsContext.Provider value={{playerStats, updatePlayerStats, playerNames, setPlayerNames}}>
            {children}
        </StatsContext.Provider>
    )
}

export default StatsProvider
