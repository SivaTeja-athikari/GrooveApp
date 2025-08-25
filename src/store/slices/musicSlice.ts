import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MusicState {
    currentAlbumId: string | null;
    isPlaying: boolean;
}

const initialState: MusicState = {
    currentAlbumId: null,
    isPlaying: false,
};

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        setCurrentAlbum: (state, action: PayloadAction<string>) => {
            state.currentAlbumId = action.payload;
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },
    },
});

export const { setCurrentAlbum, play, pause, togglePlay } = musicSlice.actions;
export default musicSlice.reducer;
