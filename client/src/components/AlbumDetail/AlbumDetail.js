import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { millisToEnglishWords } from "../../utils";
import { getAlbumInformation } from "../../api"
import { SongItem } from "./SongItem/SongItem";
import FastAverageColor from "fast-average-color";
import style from "./AlbumDetail.module.css";
import Time from "../../assets/AlbumDetail/Time";

const AlbumDetail = ({ loadSong, currentSong }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const coverRef = useRef(null);
  
    useEffect(() => {
      loadAlbumDetails(id);
    }, [id]);
  
    useEffect(() => {
      if (coverRef.current) {
        coverRef.current.crossOrigin = "Anonymous";
        const fac = new FastAverageColor();
        fac
          .getColorAsync(coverRef.current)
          .then((color) => {
            if (document.getElementById('Background')){
              document.getElementById('Background').style.backgroundColor = color.rgb;
            }
            if (document.getElementById('AlbumBackground')){
              document.getElementById('AlbumBackground').style.backgroundColor = color.rgb;
              //remove background: #141414; from html, body {}
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [album]);

    const loadAlbumDetails = async (albumId) => {
      await getAlbumInformation(albumId).then((data) => {
        setAlbum(data);
      });
    };

    const songClicked = (song) => {
      if (song.url_path) {
        song.album_image_url = album.images[0].url
        song.artists = album.artists
        loadSong(song);
      }
    };

    return (
      <React.Fragment>
        {album && album.tracks && album.tracks.items && (
          <div className={style.AlbumDetail}>
            <div className={style.Cover}>
              <div className={style.Background} id="Background"></div>
              <div className={style.Gradient}></div>
              <div className={style.Img}>
                <img
                  src={album.images[0].url}
                  alt="album img"
                  ref={coverRef}
                />
              </div>
              <div className={style.Infos}>
                <div className={style.Album}>{album.album_type.toUpperCase()}</div>
                <div className={style.Title}>
                  <h1>{album.name}</h1>
                </div>
                <div className={style.Categ}>{album.description}</div>
                <div className={style.Details}>
                  <span className={style.Text_Bold}>
                    {album.artists[0].name}
                  </span>
                  <span className={style.Text_Light}>
                    {parseInt(album.release_date)}
                  </span>
                  <span className={style.Text_Light}>
                    {
                    album.name == "Unknown Album" ? `${album.tracks.local_total} local tracks`
                    : `${album.tracks.local_total} local tracks, ${album.tracks.preview_total} previews, ${album.total_tracks} songs, 
                    ${millisToEnglishWords(album.tracks.total_duration_ms)}`
                    }
                  </span>
                </div>
              </div>
            </div>
  
            <div className={style.List_Background} id="AlbumBackground" />
            <div className={style.List}>
              <div className={style.Heading_Sticky}>
                <div className={style.Heading}>
                  <div>#</div>
                  <div>Title</div>
                  <div></div>
                  <div></div>
                  <div className={style.Length}>
                    <Time />
                  </div>
                </div>
              </div>

              {album.tracks.items.map((item, index) => (
                <SongItem
                  key={item.id}
                  song={item}
                  artists={album.artists}
                  index={index}
                  current={currentSong && item.id === currentSong.id ? true : false}
                  songClicked={() => songClicked(item)}
                />
              ))}
            </div>
            <div className={style.List_Footer}>
              <p>© {parseInt(album.release_date)} {album.label} </p>
              <p>℗ {parseInt(album.release_date)} {album.label} </p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };
  
  const mapStateToProps = (state) => {
    //console.log(`state is ${JSON.stringify(state.playing)}`);
    return {
      currentSong: state.playing.song,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      loadSong: (song) => dispatch({ type: "load", song }),
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetail);