import "./modal-image.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const getRandomPhotos = async (page) => {
  try {
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=${page}&limit=8`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const Photos = () => {
  const [status, setStatus] = useState();
  const [id, setId] = useState();
  const showModal = (itemId) => {
    setStatus((status) => "showModal");
    setId((id) => itemId);
  };
  const hideModal = () => {
    setStatus((status) => "");
  };

  const [randomPhotos, setRandomPhotos] = useState([]);
  const [nextPage, setNextPage] = useState(1);

  const handleLoadMorePhotos = async () => {
    const images = await getRandomPhotos(nextPage).then((images) => {
      const newPhotos = [...randomPhotos, ...images];
      setRandomPhotos(newPhotos);
      setNextPage(nextPage + 1);
    });
  };
  useEffect(() => {
    handleLoadMorePhotos();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-4 gap-5 p-5">
        {randomPhotos.length > 0 &&
          randomPhotos.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-white shadow-md rounded-lg lp-modal-image"
            >
              <img
                src={item.download_url}
                alt={item.author}
                className="w-full h-full object-cover rounded-lg h-[200px]"
                onClick={(itemId) => showModal(item.id)}
              />
              {item.id === id}
              {(() => {
                if (item.id === id) {
                  return (
                    <div
                      className={`modal close ${status}`}
                      onClick={hideModal}
                    >
                      <span className="close" onClick={hideModal}>
                        ×
                      </span>
                      <img
                        className="modal-content"
                        src={item.download_url}
                        alt={item.author}
                      />
                      <div className="caption">{item.author}</div>
                    </div>
                  );
                }

                return null;
              })()}
            </div>
          ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleLoadMorePhotos}
          className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl mb-8 hover:bg-sky-700 load-more"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Photos;
