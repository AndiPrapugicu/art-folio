import Button from "../../../Button/Button";
import PropTypes from "prop-types";

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="pagination-controls">
    <Button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      variant="outline"
      size="small"
    >
      Anterior
    </Button>

    <span className="page-info">
      Pagina {currentPage} din {totalPages}
    </span>

    <Button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      variant="outline"
      size="small"
    >
      Următor
    </Button>
  </div>
);

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

PaginationControls.defaultProps = {
  currentPage: 1,
  totalPages: 1,
};

export default PaginationControls;
