export interface DailyWeatherResponse {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType?: any;
  IsDayTime: boolean;
  Temperature: any;
  RealFeelTemperature: Object;
  RealFeelTemperatureShade: Object;
  RelativeHumidity: number;
  DewPoint: Object;
  Wind: Object;
  WindGust: Object;
  UVIndex: number;
  UVIndexText: string;
  Visibility: Object;
  ObstructionsToVisibility: string;
  CloudCover: number;
  Ceiling: Object;
  Pressure: Object;
  PressureTendency: Object;
  Past24HourTemperatureDeparture: Object;
  ApparentTemperature: Object;
  WindChillTemperature: Object;
  WetBulbTemperature: Object;
  Precip1hr: Object;
  PrecipitationSummary: Object;
  TemperatureSummary: Object;
  MobileLink: string;
  Link: string;
}

export interface WeatherForecastResponse {
  Headline: WeatherForecastHeadline;
  DailyForecasts: DailyForecast[];
}

export interface WeatherAutocompleteResponse {
  Version: number;
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  Country: { [Country: string]: string };
  AdministrativeArea: Object;
}

export interface GeolocationResponse {
  AdministrativeArea: Object;
  Country: { [LocalizedName: string]: string };
  DataSets: [];
  EnglishName: string;
  GeoPosition: Object;
  IsAlias: boolean;
  Key: string;
  LocalizedName: string;
  PrimaryPostalCode: string;
  Rank: number;
  Region: Object;
  SupplementalAdminAreas: [];
  TimeZone: Object;
  Type: string;
  Version: number
}

export interface DailyForecast {
  Date: string;
  EpochDate: number;
  Sun: Object;
  Moon: Object;
  Temperature: { [Minimum: string]: { [Value: string]: number } };
  RealFeelTemperature: Object;
  RealFeelTemperatureShade: Object;
  HoursOfSun: number;
  DegreeDaySummary: Object;
  AirAndPollen: Object[];
  Day: { [Day: string]: number };
  Night: Object;
  Sources: string[];
  MobileLink: string;
  Link: string;
}

export interface WeatherForecastHeadline {
  EffectiveDate: string;
  EffectiveEpochDate: number;
  Severity: number;
  Text: string;
  Category: string;
  EndDate: string;
  EndEpochDate: number;
  MobileLink: string;
  Link: string;
}