import { rpc, showLoading, hideLoading } from '@/util';

const { Ali } = window;

export default {
  namespace: 'coffeepay',
  state: {
    load: false,
    loading: false,
    name: '3333',
    coffeeList: [],
    projectInfo: {},
    user: {},
    scrollY: 0,
  },
  // effects 一般是异步行为, 远程调用服务端.
  effects: {
    *init({ payload }, { put, all }) {
      showLoading();

      const [coffeeListRes, projectInfoRes] = yield all([
        rpc.invoke('coffee.list', {
          pageSize: 100,
        }),
        rpc.invoke('project.get', {
          id: payload.id,
        }),
      ]);

      // 获取项目 owner 的支付宝账号信息;
      let user = {};
      if (Ali.isAlipay) {
        const searchRes = yield rpc.mobilegw({
          operationType: 'alipay.mobile.relation.findV2',
          requestData: [
            {
              searchString: projectInfoRes.result.alipay,
            },
          ],
        });

        if (searchRes.success === true) {
          const searchResultVOList = searchRes.searchResultVOList || [];
          user = searchResultVOList[0] || {};
          user.showName += `(${user.realName})`;
        } else {
          user.showName = '无法获取收款人信息';
        }
      } else {
        user.showName = '无法获取收款人信息';
      }

      // 更新数据
      yield put({
        type: 'updateInfo',
        payload: {
          coffeeList: coffeeListRes.result,
          projectInfo: projectInfoRes.result,
          load: true,
          user,
        },
      });

      hideLoading();
    },
  },
  // reducers 是同步行为. 不需要发请求, 仅做数据变更;
  reducers: {
    updateInfo(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
