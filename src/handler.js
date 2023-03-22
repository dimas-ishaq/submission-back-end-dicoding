/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
const { nanoid } = require('nanoid');
const books = require('./books');
// CREATE addBookHandler
const addBookHandler = (request, h) => {
  // request body
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const id = nanoid(16);
  // create new book
  const newBook = {
    // eslint-disable-next-line max-len
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };
  if (name !== undefined) {
    if (pageCount >= readPage) {
      books.push(newBook);
      const isSuccess = books.filter((book) => book.id === id).length > 0;
      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },

        });
        response.code(201);
        return response;
      }
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(400);
  return response;
};
// get allbook
const getAllBookHandler = (request) => {
  const { name, reading, finished } = request.query;
  if (Number(reading) === 1) {
    const bookRead = books.filter((book) => book.reading === true);
    return {
      status: 'success',
      data: {
        books: bookRead.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  } if (Number(reading) === 0) {
    const bookRead = books.filter((book) => book.reading === false);
    return {
      status: 'success',
      data: {
        books: bookRead.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }

  if (Number(finished) === 1) {
    const bookFinished = books.filter((book) => book.finished === true);
    return {
      status: 'success',
      data: {
        books: bookFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }
  if (Number(finished) === 0) {
    const bookFinished = books.filter((book) => book.finished === false);
    return {
      status: 'success',
      data: {
        books: bookFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }
  if (name !== undefined) {
    const bookName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return {
      status: 'success',
      data: {
        books: bookName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }
  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};
// get book by id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },

    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit book by id
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    if (name !== undefined) {
      if (readPage <= pageCount) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',

      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
// delete book by id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
