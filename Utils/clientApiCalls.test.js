import {
  postList,
  deleteList,
  patchList,
  postClientTask,
  deleteClientTask,
  fetchCaretakers,
  fetchClients,
  patchClientProfile
} from "./clientApiCalls";

describe("clientApiCalls", () => {
  describe("fetchClients", () => {
    let mockLists;

    beforeEach(() => {
      mockClients = [
        { name: "client no. 1" },
        { name: "client no. 2" },
        { name: "client no. 3" }
      ];

      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockClients)
        });
      });
    });

    it("HAPPY: should return with a parsed response", async () => {
      const result = await fetchClients();
      expect(result).toEqual(mockClients);
    });

    it("SAD: should return an error if the answer is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        });
      });
      expect(fetchClients()).rejects.toEqual(Error("Could not fetch clients"));
    });
  });

  describe("postList", () => {
    let mockList;
    let mockResponse;

    beforeEach(() => {
      mockList = {
        name: "Sample 1"
      };

      mockResponse = { id: 1 };

      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it("HAPPY: should return a parsed response", async () => {
      const result = await postList(mockList);

      expect(result).toEqual(mockResponse);
    });

    it("SAD: should return an error if status is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve(mockResponse)
        });
      });

      expect(postList(mockList)).rejects.toEqual(
        Error("Could not add new list")
      );
    });

    it("SAD: should return an error if promise rejects", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject({
          message: "Could not add new list"
        });
      });

      expect(postList(mockList)).rejects.toEqual({
        message: "Could not add new list"
      });
    });
  });

  describe("deleteList", () => {
    const mockListId = 2;
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true
        });
      });
    });

    it("should call fetch with correct data", () => {
      const expected = [
        "https://evening-dusk-50121.herokuapp.com/api/v1/lists/2",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      ];
      deleteList(mockListId);

      expect(global.fetch).toHaveBeenCalledWith(...expected);
    });

    it("SAD: should return an error if status is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        });
      });

      expect(deleteList(mockListId)).rejects.toEqual(
        Error("Could not delete list")
      );
    });

    it("SAD: should return an error if promise rejects", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject({
          message: "There was an error with the server"
        });
      });

      expect(deleteList(mockListId)).rejects.toEqual({
        message: "There was an error with the server"
      });
    });
  });

  describe("patchList", () => {
    let mockListId;
    let mockResponse;

    beforeEach(() => {
      mockListId = 2;

      mockResponse = { name: "Changed name" };

      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it("HAPPY: should return a parsed response", async () => {
      const result = await patchList(mockListId);

      expect(result).toEqual(mockResponse);
    });

    it("SAD: should return an error if status is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        });
      });

      expect(patchList(mockListId)).rejects.toEqual(
        Error("Could not edit name of list")
      );
    });

    it("SAD: should return an error if promise rejects", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject({
          message: "There was an error with the server"
        });
      });

      expect(patchList(mockListId)).rejects.toEqual({
        message: "There was an error with the server"
      });
    });
  });

  // describe("fetchClientTasks", () => {
  //   let mockTasks;

  //   beforeEach(() => {
  //     mockTasks = [
  //       { name: "test list 1" },
  //       { name: "test list 2" },
  //       { name: "test list 3" }
  //     ];

  //     global.fetch = jest.fn().mockImplementation(() => {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(mockTasks)
  //       });
  //     });
  //   });

  //   it("HAPPY: should return with a parsed response", async () => {
  //     const result = await fetchClientTasks();
  //     expect(result).toEqual(mockTasks);
  //   });

  //   it("SAD: should return an error if the answer is not ok", () => {
  //     global.fetch = jest.fn().mockImplementation(() => {
  //       return Promise.resolve({
  //         ok: false
  //       });
  //     });
  //     expect(fetchClientTasks()).rejects.toEqual(Error("Could not fetch tasks"));
  //   });
  // });

  describe("postClientTask", () => {
    let mockTask;
    let mockListId;
    let mockResponse;

    beforeEach(() => {
      mockListId = 2
      mockTask = {
        name: "Sample 1"
      };

      mockResponse = { id: 1 };

      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });
      });
    });

    it("HAPPY: should return a parsed response", async () => {
      const result = await postClientTask(mockTask, mockListId);

      expect(result).toEqual(mockResponse);
    });

    it("SAD: should return an error if status is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve(mockResponse)
        });
      });

      expect(postClientTask(mockTask)).rejects.toEqual(
        Error("Could not add new task")
      );
    });

    it("SAD: should return an error if promise rejects", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject({
          message: "Could not add new task"
        });
      });

      expect(postClientTask(mockTask)).rejects.toEqual({
        message: "Could not add new task"
      });
    });
  });

  // describe("patchClientTask", () => {
  //   let mockTask;
  //   let mockResponse;

  //   beforeEach(() => {
  //     mockTask = { name: "Sample 1" };

  //     mockResponse = { name: "Changed name" };

  //     global.fetch = jest.fn().mockImplementation(() => {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(mockResponse)
  //       });
  //     });
  //   });

  //   it("HAPPY: should return a parsed response", async () => {
  //     const result = await patchClientTask(mockTask);

  //     expect(result).toEqual(mockResponse);
  //   });

  //   it("SAD: should return an error if status is not ok", () => {
  //     global.fetch = jest.fn().mockImplementation(() => {
  //       return Promise.resolve({
  //         ok: false
  //       });
  //     });

  //     expect(patchClientTask(mockTask)).rejects.toEqual(
  //       Error("Could not edit name of task")
  //     );
  //   });

  //   it("SAD: should return an error if promise rejects", () => {
  //     global.fetch = jest.fn().mockImplementation(() => {
  //       return Promise.reject({
  //         message: "There was an error with the server"
  //       });
  //     });

  //     expect(patchClientTask(mockTask)).rejects.toEqual({
  //       message: "There was an error with the server"
  //     });
  //   });
  // });

  describe("deleteClientTask", () => {
    const mockClientId = 1;
    const mockListId = 2;
    const mockTaskId = 1;
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: true
        });
      });
    });

    it("should call fetch with correct data", () => {
      const expected = [
        "https://evening-dusk-50121.herokuapp.com/api/v1/lists/2/tasks/1",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      ];
      deleteClientTask(mockListId, mockTaskId, mockClientId);

      expect(global.fetch).toHaveBeenCalledWith(...expected);
    });

    it("SAD: should return an error if status is not ok", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false
        });
      });

      expect(deleteClientTask(mockListId, mockTaskId, mockClientId)).rejects.toEqual(
        Error("Could not delete task")
      );
    });

    it("SAD: should return an error if promise rejects", () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.reject({
          message: "There was an error with the server"
        });
      });

      expect(deleteClientTask(mockListId, mockTaskId, mockClientId)).rejects.toEqual({
        message: "There was an error with the server"
      });
    });
  });

//   describe("fetchProfile", () => {
//     let mockProfile;

//     beforeEach(() => {
//       mockProfile = { name: "test list 1", email: "test@test.com" };

//       global.fetch = jest.fn().mockImplementation(() => {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve(mockProfile)
//         });
//       });
//     });

//     it("HAPPY: should return with a parsed response", async () => {
//       const result = await fetchProfile();
//       expect(result).toEqual(mockProfile);
//     });

//     it("SAD: should return an error if the answer is not ok", () => {
//       global.fetch = jest.fn().mockImplementation(() => {
//         return Promise.resolve({
//           ok: false
//         });
//       });
//       expect(fetchProfile()).rejects.toEqual(Error("Could not fetch profile"));
//     });
//   });
});
