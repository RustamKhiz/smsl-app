export const environment = {
  production: true,
  apiUrl: 'https://lk.resultcontrol.ru'
};
// https://lk.resultcontrol.ru
// https://debug.resultcontrol.ru
`public class NearbyReport
        {
            public   NearbyReport()
            {

            }

            public  ChiefWorkReport ChiefWorkReport  { get; set; }

            public Nearby Next { get; set; }
            public Nearby Prev { get; set; }

            public bool IsNext { get; set; }
            public bool IsPrev { get; set; }


            public class Nearby
            {
                public int Id { get; set; }
                public int СhiefUserId { get; set; }

                public int GeneralLocationId { get; set; }
                public DateTime DataReport { get; set; }

            }
        }`
