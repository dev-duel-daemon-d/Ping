import React, { useState, useEffect } from "react";
import {
  Camera,
  Gamepad2,
  X,
  Send,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { uploadService, gameService, postService } from "../services/api";

const CreatePost = ({ onPostCreated, type = "casual" }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [selectedGame, setSelectedGame] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await gameService.getAll();
      setGames(res.data);
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadService.uploadImage(formData);
      setMedia(res.data.url);
    } catch (err) {
      console.error("Upload failed", err);
      setMediaPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) return;

    setLoading(true);
    try {
      const postData = {
        content,
        media,
        type: type, // Use prop directly
        game: type === "professional" ? selectedGame : null,
      };

      await postService.create(postData);

      setContent("");
      setMedia(null);
      setMediaPreview(null);
      setSelectedGame("");

      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
      relative bg-[#1b1f23]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-8 transition-all duration-300
      ${isFocused ? "border-lime-500/30 shadow-[0_0_30px_-10px_rgba(132,204,22,0.15)]" : "hover:border-white/10"}
    `}
    >
      <div className="flex gap-5">
        <Avatar
          src={user?.avatar}
          className="w-12 h-12 border-2 border-lime-500/20 shadow-lg shadow-black/50"
        >
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>

        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              type === "professional"
                ? "Share your achievements, clips, or find a team..."
                : "What's on your mind?"
            }
            className="w-full bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none min-h-[100px] text-lg leading-relaxed py-2"
          />

          {mediaPreview && (
            <div className="relative mt-4 rounded-xl overflow-hidden max-h-[400px] w-full bg-black/40 border border-white/10 group">
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => {
                  setMedia(null);
                  setMediaPreview(null);
                }}
                className="absolute top-3 right-3 bg-black/60 p-2 rounded-full text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
              >
                <X size={18} />
              </button>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="bg-black/80 p-4 rounded-2xl flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                    <span className="text-xs font-bold text-lime-500">
                      Uploading...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-white/5 gap-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer group relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                <div className="p-2.5 rounded-xl bg-white/5 text-slate-400 group-hover:text-lime-400 group-hover:bg-lime-500/10 transition-all duration-300">
                  <ImageIcon size={22} />
                </div>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Add Image
                </span>
              </label>

              {type === "professional" && (
                <div className="relative group">
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="appearance-none bg-[#1b1f23] text-slate-300 text-sm font-medium py-2.5 pl-10 pr-4 rounded-xl border border-white/10 hover:border-lime-500/30 hover:bg-white/5 focus:outline-none focus:border-lime-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Game</option>
                    {games.map((g) => (
                      <option key={g._id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <Gamepad2 className="absolute left-3 top-2.5 w-5 h-5 text-slate-500 group-hover:text-lime-500 transition-colors pointer-events-none" />
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || uploading || (!content.trim() && !media)}
              className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-black rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Post <Send size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

