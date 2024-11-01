import PropTypes from "prop-types";
import usePortfolioDetail from "../../../utils/usePortfolioDetail";
import PortfolioHeader from "./PortfolioHeader/PortfolioHeader";
import { PaginationControls } from "./PortfolioControls/PaginationControls";
import PortfolioSlider from "./PortfolioSlider/PortfolioSlider";
import UploadForm from "./UploadForm/UploadForm";
import ConfirmDialog from "./ConfirmDialog/ConfirmDialog";
import ArtworkCard from "./ArtworkCard/ArtworkCard";
import "./PortfolioDetail.css";

const PortfolioDetail = ({ initialArtworks = [] }) => {
  const {
    category,
    urlUsername,
    isLoggedIn,
    user,
    userArtworks,
    showUploadForm,
    uploadStatus,
    isStatusFading,
    showConfirmDialog,
    artworkToDelete,
    currentPage,
    itemsPerPage,
    setShowUploadForm,
    setShowConfirmDialog,
    setArtworkToDelete,
    setCurrentPage,
    handleSubmit,
    handleDeleteArtwork,
    handleHideArtwork,
  } = usePortfolioDetail(initialArtworks);

  const totalPages = Math.ceil(userArtworks.length / itemsPerPage);
  const currentItems = userArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="portfolio-detail">
      <PortfolioHeader
        category={category}
        username={urlUsername || user?.username}
        isLoggedIn={isLoggedIn}
        showUploadForm={showUploadForm}
        onToggleUpload={() => setShowUploadForm(!showUploadForm)}
      />

      {isLoggedIn && showUploadForm && (
        <UploadForm
          onSubmit={handleSubmit}
          category={category}
          onClose={() => setShowUploadForm(false)}
        />
      )}

      {uploadStatus && (
        <p
          className={`upload-status ${
            uploadStatus.includes("Eroare") ? "error" : "success"
          } ${isStatusFading ? "fade-out" : ""}`}
        >
          {uploadStatus}
        </p>
      )}

      {userArtworks.length > 0 ? (
        <div className="portfolio-slider-container">
          <div className="desktop-view">
            <PortfolioSlider
              artworks={userArtworks}
              onHide={handleHideArtwork}
              onDelete={handleDeleteArtwork}
              onSubmit={handleSubmit}
              user={user}
              category={category}
            />
          </div>

          <div className="mobile-view">
            <div className="portfolio-items">
              {currentItems.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onHide={handleHideArtwork}
                  onDelete={() => {
                    setArtworkToDelete(artwork);
                    setShowConfirmDialog(true);
                  }}
                  isOwner={user?.id === artwork.userId}
                  user={user}
                />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      ) : (
        <div className="empty-portfolio">
          <p>
            Nu aveți încă opere de artă în categoria {category}.
            {isLoggedIn &&
              " Folosiți butonul 'Upload Artwork' pentru a adăuga prima dvs. operă!"}
          </p>
        </div>
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          artwork={artworkToDelete}
          onConfirm={() => {
            handleDeleteArtwork(artworkToDelete.id);
            setShowConfirmDialog(false);
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

PortfolioDetail.propTypes = {
  initialArtworks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      datePosted: PropTypes.string,
      artist: PropTypes.string,
      category: PropTypes.string,
      userId: PropTypes.number,
    })
  ),
};

export default PortfolioDetail;
