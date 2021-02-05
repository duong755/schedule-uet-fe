export namespace ClassMembersResponse {
  export type ClassInfo = {
    MaLMH: string;
    TenMonHoc: string;
    Nhom: string;
    SoTinChi: number;
  };

  export type StudentInfo = {
    id: string;
    MaSV: string;
    HoVaTen: string;
    NgaySinh: string;
    LopKhoaHoc: string;
  };

  export type Response = {
    message: string;
    data: (ClassInfo & StudentInfo)[];
  };
}
