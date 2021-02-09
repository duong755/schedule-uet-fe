export namespace ClassMembersResponse {
  export type ClassGroup = {
    GiaoVien: string;
    SoSV: string | number;
    Thu: string | number;
    Tiet: string;
    GiangDuong: string;
    Ten: string;
  };

  export type ClassInfo = {
    MaLMH: string;
    TenMonHoc: string;
    TinChi: number | string;
    Nhom: ClassGroup[];
  };

  export type StudentInfo = {
    _id: string;
    MaSV: string;
    HoVaTen: string;
    NgaySinh: string;
    LopKhoaHoc: string;
    MaLMH: string;
    TenMonHoc: string;
    Nhom: string;
    SoTinChi: number;
    GhiChu: string;
  };

  export type Response = {
    message: string;
    data: {
      classInfo: ClassInfo;
      students: StudentInfo[];
    };
  };
}
